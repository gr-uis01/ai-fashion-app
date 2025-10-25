// backend/server.js

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup file upload directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Test route
app.get("/", (req, res) => {
  res.send("✅ AI Fashion Backend is running...");
});

// Process route (upload + AI image generation)
app.post("/process", upload.fields([{ name: "model" }, { name: "clothing" }]), async (req, res) => {
  try {
    if (!req.files || !req.files.model || !req.files.clothing) {
      return res.status(400).json({ error: "Please upload both model and clothing images." });
    }

    const modelFile = req.files.model[0];
    const clothingFile = req.files.clothing[0];

    console.log("Received model:", modelFile.originalname);
    console.log("Received clothing:", clothingFile.originalname);

    // Define AI prompts
    const prompts = [
      "Enhance the clothing photo — make it clean, high-quality, white background.",
      "Generate the model wearing the uploaded clothing naturally.",
      "Create a back view of the clothing item.",
      "Generate the back view of the model wearing the clothing."
    ];

    const results = [];
    for (const prompt of prompts) {
      const aiResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      });
      results.push(aiResponse.data[0].url);
    }

    res.json({
      success: true,
      images: results
    });

  } catch (error) {
    console.error("❌ Error processing images:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
