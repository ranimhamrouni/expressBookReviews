const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//register a user
public_users.post("/register" ,(req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if(isValid(username)) res.status(409).json({message:"The username already exists"});
    else {
      user = {
        username,
        password
      }
      users.push(user);
      return res.status(201).json({message:"User has been added!"});
    }
  } else {
    return res.status(400).json({message:"Verify your credentials"});
  }
})

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = new Promise((resolve,reject) => {
      if(books) resolve(books);
      else reject("Unable to find books");
    })
    const data = await getAllBooks;
    res.send(JSON.stringify(data,null,4));
  } catch(err) {
    res.status(500).json({message:"Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve,reject) => {
      if(books[isbn]) resolve(books[isbn]);
      else reject("Unable to find book");
    })
    const data = await getBook;
    res.send(JSON.stringify(data,null,4));
  } catch(err) {
    res.status(500).json({message:"Error fetching book"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req,res) {
  try {
    const author = req.params.author;
    const getBook = new Promise((resolve,reject) => {
      bookList = Object.values(books).filter((book) => book.author === author);
      if(bookList.length>0) resolve(bookList);
      else reject("Unable to find books");
    }) 
    const data = await getBook;
    res.send(JSON.stringify(data,null,4));
  } catch(err) {
      res.status(500).json({message:"Error fetching book"});
  }
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let bookList =  Object.values(books);
  bookList = bookList.filter(book => book.title === title);
  if(bookList.length > 0){
    res.send(JSON.stringify(bookList,null,4));
  } else {
    res.send("No books found for the given title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.send(JSON.stringify(books[isbn].reviews,null,4));
  } else {
    res.send("Book not found");
 }
});

module.exports.general = public_users;
