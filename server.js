const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

const conn_str = `mongodb+srv://rotoflals:lee8670@cluster0.6oflekf.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(conn_str);
    console.log("mongodb is connected");
  } catch (err) {
    console.error('error in connection', err);
  }
};

connectDB();

const PostSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', PostSchema, 'post');

app.use(cors({
  origin: ['http://localhost:3000', 'https://minwo.github.io/mwtest']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/post', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find().skip(skip).limit(limit);
    const total = await Post.countDocuments();
    res.json({ posts, total });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/post/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
      const updatedPost = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
      res.status(200).json(updatedPost);
  } catch (err) {
      res.status(500).send(err);
  }
});

// Add POST endpoint
app.post('/post', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
