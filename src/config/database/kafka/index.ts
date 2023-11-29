import { Kafka } from "kafkajs"
import * as dotenv from 'dotenv'
dotenv.config()


export default new Kafka ({

    clientId:"jaali.dev",
    brokers:[
        `${process.env.KAFKA_HOST}:${process.env.KAFKA_BROKER_PORT_ONE}`,
        `${process.env.KAFKA_HOST}:${process.env.KAFKA_BROKER_PORT_TWO}`
    ] 
})


//  Note:
// ["<PRIVATE_IP or KAFKA_HOST>:KAFKA_BROKER_PORT_ONE",]
// brokers mean kafka db

