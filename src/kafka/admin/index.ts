import type { ITopicConfig } from "kafkajs"
import kafka from "../../config/database/kafka"

// ITopicConfig

export const createSingleTopic = async (topic_: ITopicConfig) => {
    const admin = kafka.admin()
    console.log("Admin connecting...")
    try {
        await admin.connect()
        console.log("Adming Connection Success...")
        const topicExists = (await kafka.admin().listTopics()).includes(topic_.topic)
        if (!topicExists) {
            console.log(`Creating Topic [${topic_.topic}]`)
            await admin.createTopics({
                waitForLeaders: true,
                topics: [
                    {
                        ...topic_
                    }
                ],
            })
            console.log(`Topic Created Success [${topic_.topic}]`)
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Disconnecting Admin..")
        admin && await admin.disconnect()
    }
}
