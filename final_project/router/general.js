const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let userName = req.body.username;
    let pass = req.body.password;

    if (!userName || !pass) {
        return res.status(400).json({ message: "Username and password must be provided" });
    } else {
        if (isValid(userName)) {
            return res.status(400).json({ message: "user exists" });
        } else {
            users.push({
                username: userName,
                password: pass
            });
            return res.status(201).json({ message: `user ${userName} registered` });
        }
    }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    let allBooks = await JSON.stringify(books)
    return res.send(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    if (isbn) {
        let foundBook = books[isbn]

        let myPromise1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(foundBook)
            }, 5000)
        });

        myPromise1.then((data) => { 
            return res.send(data) 
        })
    }
    ;
    //   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author;
    let found = [];
    if (author) {
        let bookKeys = Object.keys(books);
        await bookKeys.forEach((bookkKey) => {
            if (author === books[bookkKey].author) {
                found.push(books[bookkKey])
            }
        });
        if (found[0]) {
            return res.status(200).json(found);
        } else {
            return res.status(404).json({ message: "author not found" })
        }
    } else {
        return res.status(404).json({ message: "author parameter not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    let title = req.params.title;
    let found = [];
    if (title) {
        let bookKeys = Object.keys(books);
        await bookKeys.forEach((bookkKey) => {
            if (title === books[bookkKey].title) {
                found.push(books[bookkKey])
            }
        });
        if (found[0]) {
            return res.status(200).json(found);
        } else {
            return res.status(404).json({ message: "title not found" })
        }
    } else {
        return res.status(404).json({ message: "title parameter not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    let fetchedReview = books[isbn].reviews;
    if (fetchedReview) {
        return res.status(200).json({ reviews: fetchedReview });
    } else {
        return res.status(404).json({ message: "No review" });
    }
});

module.exports.general = public_users;
