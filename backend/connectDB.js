/* eslint-disable prettier/prettier */
import AWS from 'aws-sdk'

AWS.config.update({
    region: "eu-west-3",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const db = new AWS.DynamoDB.DocumentClient()

const Table = 'Plantsgallery'

export {
    db,
    Table
}