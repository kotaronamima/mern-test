const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS設定（Reactからのアクセスを許可）
app.use(cors());

// MongoDB接続
mongoose.connect('mongodb://localhost:27017/mern-test-db')
  .then(() => {
    console.log('MongoDBに接続しました');
  })
  .catch((err) => {
    console.error('MongoDB接続エラー:', err);
  });

// 写真データ用のスキーマ定義
const PhotoSchema = new mongoose.Schema({
  title: String,
  size: String
});

const Photo = mongoose.model('Photo', PhotoSchema);

// アプリ起動時に初期データを投入（データが空の場合のみ）
async function initializeData() {
  try {
    const count = await Photo.countDocuments();
    if (count === 0) {
      const initialPhotos = [
        { title: "沖縄の海", size: "L判" },
        { title: "京都の紅葉", size: "L判" },
        { title: "富士山", size: "2L判" }
      ];
      await Photo.insertMany(initialPhotos);
      console.log('初期データを保存しました');
    }
  } catch (err) {
    console.error('初期データ投入エラー:', err);
  }
}

// MongoDB接続後に初期データを投入
mongoose.connection.once('open', () => {
  initializeData();
});

// ルートURLへのアクセス
app.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json({
      message: "API稼働中",
      data: photos
    });
  } catch (err) {
    console.error('データ取得エラー:', err);
    res.status(500).json({
      message: "エラーが発生しました",
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
