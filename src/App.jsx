import { useState } from "react";
import axios from "axios";

function App() {
  const [model, setModel] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("model", model);
    formData.append("clothing", clothing);

    setLoading(true);
    const res = await axios.post("http://localhost:5000/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setImages(res.data.images);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>AI Fashion Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setModel(e.target.files[0])} />
        <input type="file" onChange={(e) => setClothing(e.target.files[0])} />
        <button type="submit">Generate</button>
      </form>

      {loading && <p>Generating...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
        {images.map((img, i) => (
          <img key={i} src={img} alt={`result-${i}`} style={{ width: "100%", borderRadius: "10px" }} />
        ))}
      </div>
    </div>
  );
}

export default App;
