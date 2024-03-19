const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access' ,{ expiresIn: 600 * 60 }); //

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  let filtered_book = books[isbn];
  if (filtered_book) {
      if(review) {        
        if (filtered_book.reviews[username]) { 
            filtered_book.reviews[username] = review;           
            return res.json({message: "Review modified successfully"});
          }
        else {
            filtered_book.reviews[username] = review;
            return res.json({message: "New review is added successfully"});
        }
        
    }
      books = books[!isbn];
      books.push(filtered_book);
      res.send(`Books with the ISBN  ${isbn} updated.`);
  }
  else{
      res.send("Unable to find book!");
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = "a" //req.session.username;
    const isbn = req.params.isbn;
    const filtered_book = books[isbn];
    delete filtered_book.reviews[username];
    // filtered_book.reviews =  filtered_book.reviews.filter((review) => review.username === username);
    // //Object.values(books)
    // books = books[!isbn];
    // books.push(filtered_book);
    res.send(`Review in book with  ${isbn} deleted.`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
