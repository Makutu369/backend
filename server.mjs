import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json'); // Define the path to your data file

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all documents
app.get('/documents', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to add a new document
app.post('/documents', (req, res) => {
  const newDocument = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }

    let documents = JSON.parse(data);
    documents.push(newDocument);

    fs.writeFile(DATA_FILE, JSON.stringify(documents, null, 4), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file');
      }
      res.send('Document added successfully');
    });
  });
});

// Endpoint to update a document
app.put('/documents/:id', (req, res) => {
  const documentId = parseInt(req.params.id, 10);
  const updatedContent = req.body.content;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }

    let documents = JSON.parse(data);
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return res.status(404).send('Document not found');
    }

    documents[documentIndex].content = updatedContent;

    fs.writeFile(DATA_FILE, JSON.stringify(documents, null, 4), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file');
      }
      res.send('Document updated successfully');
    });
  });
});

// Endpoint to delete a document
app.delete('/documents/:id', (req, res) => {
  const documentId = parseInt(req.params.id, 10);

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }

    let documents = JSON.parse(data);
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return res.status(404).send('Document not found');
    }

    documents.splice(documentIndex, 1); // Remove the document

    fs.writeFile(DATA_FILE, JSON.stringify(documents, null, 4), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file');
      }
      res.send('Document deleted successfully');
    });
  });
});

// Endpoint to update the document name
app.put('/documents/:id/name', (req, res) => {
  const documentId = parseInt(req.params.id, 10);
  const newName = req.body.name;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data file');
    }

    let documents = JSON.parse(data);
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      return res.status(404).send('Document not found');
    }

    documents[documentIndex].name = newName;

    fs.writeFile(DATA_FILE, JSON.stringify(documents, null, 4), (err) => {
      if (err) {
        return res.status(500).send('Error writing data file');
      }
      res.send('Document name updated successfully');
    });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
