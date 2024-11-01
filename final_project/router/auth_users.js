const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    if (users.find((user) => {
        return user.username === username
    })) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    if (isValid(username)) {
        const foundUser = users.filter((user) => {
            return user.password === password;
        })
        if (foundUser) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const userName = req.body.username;
    const pass = req.body.password;
    if (!userName || !pass) {
        return res.status(400).json({ message: "Username and password must be provided" });
    }
    if (authenticatedUser(userName, pass)) {
        let accessToken = jwt.sign({ username: userName }, "accesstoken", { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken
        };
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid login credentials" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const reviewToAdd = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
    let existingReviews = book.reviews;
    const user = req.user.username;

    if (!book) {
        return res.status(404).json({ message: "book not found" });
    }

    if (!reviewToAdd) {
        return res.status(404).json({ message: "no review to add" });
    }
    //   if (!existingReviews) {
    //     existingReviews.push({user: reviewToAdd});
    //     book.reviews = existingReviews;
    //     return res.status(201).json({ message: "review added"})
    //   } else {
    let userReview = existingReviews[user]

    if (userReview) {
        // userReview.push({user: reviewToAdd});
        books[isbn].reviews[user] = reviewToAdd;
        return res.status(200).json({ message: "review modified" })
    } else {
        // existingReviews.push({user: reviewToAdd});
        // book.reviews = existingReviews;
        books[isbn].reviews[user] = reviewToAdd
        return res.status(201).json({ message: "review added" })
    };
    //   };
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    let existingReviews = book.reviews;
    const user = req.user.username;

    if (!book) {
        return res.status(404).json({ message: "book not found" });
    }

    let userReview = existingReviews[user]

    if (userReview) {
        // userReview.push({user: reviewToAdd});
        delete books[isbn].reviews[user];
        return res.status(200).json({ message: "review deleted" })
    } else {
        return res.status(404).json({ message: "review not found" })
    };
    //   };
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
