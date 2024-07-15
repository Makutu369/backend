import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Document } from "./models/document.js";
import mongoose from "mongoose";

// Helper to get __dirname in ES modules
mongoose
  .connect("mongodb://localhost:27017/amalitech_UI")
  .then(() => console.log("db success"))
  .catch((e) => console.log(e));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all documents
app.get("/documents", async (req, res) => {
  const document = await Document.find({});
  res.status(200).json(document);
});

// Endpoint to add a new document
app.post("/documents", async (req, res) => {
  const { name, content } = req.body;

  const document = new Document({
    name,
    content,
  });

  await document.save();
  res.status(200).json(document);
});

// Endpoint to update a document
app.post("/documents/:id", async (req, res) => {
  const id = req.params.id;
  const { name, content } = req.body;
  const document = await Document.findById(id);

  document.content = content;
  document.name = name;

  await document.save();
  res.status(200).json(document);
});

// Endpoint to delete a document
app.delete("/documents/:id", async (req, res) => {
  const { id } = req.params;
  const document = await Document.findByIdAndDelete(id);
  if (!document)
    return res.status(400).json({ message: "document delete successfully" });

  res.status(200).json("document deleted successfully");
});

// Endpoint to update the document name
app.put("/documents/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const document = await Document.findById(id);
  if (!document) return res.status(400).json({ message: "document not found" });
  document.name = name;
  await document.save();

  res.status(200).json(document);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
