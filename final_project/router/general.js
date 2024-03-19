const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/',function (req, res) {
  //Write your code here
  getBooks().then((result) => res.send(JSON.stringify(result,null,4)));
  //res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}


public_users.get('/isbn/:isbn',function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
    //res.send(books[req.params.isbn]);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
    //   const author = req.params.author;
//   let filtered_books = Object.values(books).filter((book) => book.author === author);
//   res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
    //   const title = req.params.title;
//   let filtered_books = Object.values(books).filter((book) => book.title === title);
//   res.send(filtered_books);
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const filtered_books = books[req.params.isbn]
  res.send(filtered_books.review);
});



module.exports.general = public_users;
