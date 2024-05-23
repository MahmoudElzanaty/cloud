/* eslint-disable prettier/prettier */
// server.js
import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'
import { db, Table } from './connectDB.js'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'

const app = express()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const generateFileName = (bytes = 4) => parseInt(crypto.randomBytes(bytes).toString('hex'), 16)

app.get("/api/posts", async (req, res) => {
  const params = {
    TableName: Table,
  };

  try {
    const data = await db.scan(params).promise();
    const postsWithImageUrl = [];
    for (let post of data.Items) {
      post.imageUrl = await getObjectSignedUrl(post.imageName);
      postsWithImageUrl.push(post);
    }
    res.send(postsWithImageUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Server error' });
  }
});

app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const id = generateFileName()

  const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer()

  await uploadFile(fileBuffer, id.toString(), file.mimetype)

  const post = {
    TableName: Table,
    Item: {
      id,
      imageName: id.toString(),
      caption,
    }
  };

  await db.put(post).promise();

  res.status(201).send(post.Item)
})

app.delete("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid id' });
  }
  const params = {
    TableName: Table,
    Key: {
      id: id,
    }
  };

  try {
    const data = await db.get(params).promise();
    if (!data.Item) {
      return res.status(404).send({ message: 'Post not found' });
    }

    await deleteFile(data.Item.imageName);
    await db.delete(params).promise();

    res.send(data.Item);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Server error' });
  }
});

app.listen(8080, () => console.log("listening on port 8080"))