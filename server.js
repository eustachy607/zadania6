const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const Book = require('./models/book'); // Model Book

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Insert operation
app.post('/books', async (req, res) => {
    const { title, author, genre, publishYear, pages } = req.body;
    const book = new Book({ title, author, genre, publishYear, pages });
    
    try {
        await book.save();
        res.status(201).send('Book added successfully');
    } catch (err) {
        res.status(500).send('Error adding book');
    }
});

// Find operation
app.get('/books', async (req, res) => {
    const { title, author, genre } = req.query;
    let query = {};
    if (title) query.title = title;
    if (author) query.author = author;
    if (genre) query.genre = genre;

    try {
        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).send('Error finding books');
    }
});

// Update operation
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        await Book.findByIdAndUpdate(id, updateData);
        res.status(200).send('Book updated successfully');
    } catch (err) {
        res.status(500).send('Error updating book');
    }
});

// Delete operation
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.findByIdAndDelete(id);
        res.status(200).send('Book deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting book');
    }
});

// Count Documents
app.get('/books/count', async (req, res) => {
    try {
        const count = await Book.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).send('Error counting books');
    }
});

// Retrieve Distinct Values of a Field
app.get('/books/distinct/:field', async (req, res) => {
    const { field } = req.params;

    try {
        const distinctValues = await Book.distinct(field);
        res.status(200).json(distinctValues);
    } catch (err) {
        res.status(500).send(`Error retrieving distinct values for field: ${field}`);
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
