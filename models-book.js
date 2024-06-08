const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishYear: { type: Number, required: true },
    pages: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema);
