const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let user = users.filter(user => user.username === username);
  return(user.length>0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let user = users.filter(user => (user.username === username) && (user.password === password));
  return(user.length>0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if(authenticatedUser(username,password)) {
      let token = jwt.sign({
        data:password,
      },'access',
        {expiresIn : 60*60});
      req.session.authorization = { accessToken: token, username: username};
      return res.status(200).json({message:"User logged in"});
    }
    else return res.status(403).json({message:"User not authenticated"});
  } else return res.status(401).json({message:"Error logging in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(!req.session.authorization) {
    return res.status(403).json({message:"User not logged in"})
  }
  if(!books[isbn]) {
    return res.status(400).json({message:"Unable to find book"});
  }
  let book = books[isbn];
  const review = req.query.review;
  const username = req.session.authorization.username;
  book.reviews[username] = review;
  return res.status(200).json({message:"Review added"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  if(!book.reviews[username]) {
    return res.status(400).json({message:"Review not found"});
  }
  delete book.reviews[username];
  return res.status(200).json({message:"Review deleted!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
