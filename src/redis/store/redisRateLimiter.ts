import type { Request, Response, NextFunction } from "express"
import moment from "moment"
import redis from "../../config/database/redis"

const WINDOW_SIZE_IN_HOURS = 24
const MAX_WINDOW_REQUEST_COUNT = 100
const WINDOW_LOG_INTERVAL_IN_HOURS = 1

export const redisRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check that redis client exists
    if (!redis) {
      throw new Error('Redis client does not exist!')
      process.exit(1)
    }
    // fetch records of current user using IP address, returns null when no record is found
    const record: string | null = await redis.get(req.ip as string)
    const currentRequestTime: moment.Moment = moment()
    console.log(record)
    //  if no record is found , create a new record for user and store to redis
    if (record == null) {
      let newRecord: { requestTimeStamp: number, requestCount: number }[] = []
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      }
      newRecord.push(requestLog)
      await redis.set(req.ip as string, JSON.stringify(newRecord))
      next()
    }
    // if record is found, parse it's value and calculate the number of requests users has made within the last window
    let data = JSON.parse(record || "")
    let windowStartTimestamp: number = moment().subtract(WINDOW_SIZE_IN_HOURS, 'hours').unix()
    let requestsWithinWindow = data.filter((entry: any) => {
      return entry.requestTimeStamp > windowStartTimestamp
    })
    console.log('requestsWithinWindow', requestsWithinWindow)
    let totalWindowRequestsCount: number = requestsWithinWindow.reduce((accumulator: number, entry: any) => {
      return accumulator + entry.requestCount
    }, 0)
    // if the number of requests made is greater than or equal to the desired maximum, return an error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res.status(429).json({ error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!` })
    } else {
      // if the number of requests made is less than the allowed maximum, log a new entry
      let lastRequestLog = data[data.length - 1]
      let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix()
      //  if the interval has not passed since the last request log, increment the counter
      if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
        lastRequestLog.requestCount++
        data[data.length - 1] = lastRequestLog
      } else {
        //  if the interval has passed, log a new entry for the current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        })
      }
      await redis.set(req.ip as string, JSON.stringify(data))
      next()
    }
  } catch (error) {
    next(error)
  }
}
