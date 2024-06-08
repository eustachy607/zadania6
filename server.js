const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const app = express();

const User = require('./models/user'); 
const Book = require('./models-book'); 
// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return { salt, hash };
};


const validatePassword = (password, salt, hash) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash === hashVerify;
};


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const { salt, hash } = hashPassword(password);
    const user = new User({ username, password: `${salt}:${hash}` });

    try {
        await user.save();
        res.status(201).send('User registered!');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const [salt, hash] = user.password.split(':');
        const isValid = validatePassword(password, salt, hash);

        if (isValid) {
            res.status(200).send('Login successful');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});


app.get('/books/count', async (req, res) => {
    try {
        const count = await Book.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).send('Error fetching count');
    }
});


app.get('/books', async (req, res) => {
    const { genre, minPages, minYear } = req.query;
    let query = {};

    if (genre) {
        query.genre = genre;
    }

    if (minPages) {
        query.pages = { $gte: Number(minPages) };
    }

    if (minYear) {
        query.publishYear = { $gte: Number(minYear) };
    }

    try {
        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).send('Error fetching books');
    }
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
