/* eslint-disable prettier/prettier */
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { URL } from 'url';

import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export async function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  };

  const command = new PutObjectCommand(uploadParams);
  const response = await s3Client.send(command);

  return response;
}

export async function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  const command = new DeleteObjectCommand(deleteParams);
  const response = await s3Client.send(command);

  return response;
}

export async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  const command = new GetObjectCommand(params);
  const seconds = 60 * 60;
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  const url = new URL(signedUrl);
  const baseUrl = url.origin + url.pathname;

  return baseUrl;
}
