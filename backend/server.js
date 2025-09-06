import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";
import { uploadToCloudinary } from "./cloudnary.js";
import cors from "cors";
// import { log } from "node:console";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// POST /generate
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    const candidate = response.candidates[0].content.parts.find(
      (part) => part.inlineData
    );

    if (!candidate) {
      return res.status(500).json({ error: "No image data returned" });
    }

    const imageData = candidate.inlineData.data;
    const buffer = Buffer.from(imageData, "base64");

    const fileName = `output_${Date.now()}.png`;
    fs.writeFileSync(`./image/${fileName}`, buffer);

    
    const imageUrl = await uploadToCloudinary(`./image/${fileName}`, fileName);
    // const imageUrl = await uploadToCloudinary(fileName, fileName);
    await fs.unlinkSync(`./image/${fileName}`);
    res.json({ message: "Image generated successfully", imageUrl });
    console.log("Image URL:", imageUrl);
    
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
