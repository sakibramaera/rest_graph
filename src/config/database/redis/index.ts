import { Redis } from "ioredis"

export default new Redis({
    port: 6379,
    host: "127.0.0.1"
})
