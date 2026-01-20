import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ページ読み込み時にデータを取得
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(data => {
        setPhotos(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('データの取得に失敗しました');
        setLoading(false);
        console.error('Error:', err);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>写真ギャラリー</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>写真ギャラリー</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>写真ギャラリー</h1>
      <div className="photo-grid">
        {photos.length === 0 ? (
          <p>写真がありません</p>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="photo-card">
              <h3>{photo.title}</h3>
              <p className="photo-size">サイズ: {photo.size}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App
