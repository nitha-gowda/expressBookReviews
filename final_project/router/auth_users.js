const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 * 60});
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({message : "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  const review = req.query.review;
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(review && book){
    let updatedReviews = book.reviews;
    updatedReviews[username] = review;
    
    book.reviews = updatedReviews;
    res.status(200).send(`Review for the book with ISBN ${isbn} is added/updated.`);
  }
  res.status(208).send({message: `Book with ISBN ${isbn} not found !`});
});

//Deleta a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization.username;
    const isbn = req.params.isbn;
    let currentreviews = books[isbn].reviews;
    
   // delete(books[isbn].reviews);
   // res.send(`Review for ISBN ${isbn} added by ${username} is deleted`);
   res.send(currentreviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
