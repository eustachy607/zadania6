const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Book = require('./models-book'); 
mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const generateBooks = async (num) => {
    let books = [];
    for (let i = 0; i < num; i++) {
        const book = new Book({
            title: faker.lorem.words(3),
            author: faker.name.fullName(),
            genre: faker.music.genre(),
            publishYear: faker.date.past(50).getFullYear(),
            pages: faker.datatype.number({ min: 100, max: 1000 })
        });
        books.push(book);
    }
    return books;
};

const populateDatabase = async () => {
    console.time('populateDatabase');
    const books = await generateBooks(1000);
    await Book.insertMany(books);
    console.timeEnd('populateDatabase');
    mongoose.connection.close();
};

populateDatabase();
