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

// 'post' 컬렉션에 대한 스키마 정의
const PostSchema = new mongoose.Schema({
  title: String,
  content: String
});

// 'post' 컬렉션에 대한 모델 생성
const Post = mongoose.model('Post', PostSchema, 'post');

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 루트 URL('/')에 대한 GET 요청을 처리하는 라우트 핸들러
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 'post' 컬렉션의 모든 문서를 가져오는 API 엔드포인트
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 'post' 컬렉션에 새로운 문서를 추가하는 API 엔드포인트
app.post('/post', async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 서버를 시작하여 특정 포트에서 수신 대기
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
