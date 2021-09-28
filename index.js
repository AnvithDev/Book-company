// Main Backend file

const db = require("./database/index.js") //get the index.js file
const mongoose = require('mongoose');  //imported mongoose module
// console.log(db);
// console.log(db.books)                  
// console.log(db.authors)                  
// console.log(db.publications)

const express=require("express"); //gets the express framework(is used everytime the express framework is needed)
const app=express();
app.use(express.json());

// code from MongoDB itself
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Anvith_Dev:KqWfh8Is7Npg9gDV@cluster0.s7szx.mongodb.net/BOOK-COMPANY?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(client)
client.connect(err => {
  const book_collection = client.db("BOOK-COMPANY").collection("books").findOne({ISBN:"1234Three"});  //findOne() is an method from MongoDB
  book_collection.then((data)=>console.log(data)).catch((err)=>console.log(err));
  // perform actions on the collection object
});
client.close();

// =======================================  Alternate method for above code  =======================================
// async function main() {
//     const uri = "mongodb+srv://nikhil_agarwal:p5nfHZEoRnTA2VGb@cluster0.arwlh.mongodb.net/book-company?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     try {
//         await client.connect();
//         const result = await client.db("book-company").collection("books").findOne({ISBN: "1234Three"});
//         console.log(result);
//         // await listDatabases(client);
//     }
//     catch(err) {
//         console.log(err);
//     }
//     finally {
//         await client.close();
//     }
// }
// main();

//   localhost:3000/
app.get("/",(req,res)=>{
    res.json({"Welcome_msg":"WELCOME TO MY BOOK MANAGEMENT BACKEND!!!!!!!!!!!"})
})

//   localhost:3000/books
app.get("/books", (req,res) =>{
    const getAllBooks = db.books;
    return res.json(getAllBooks)  //res.json() sends the js object in json format to the localhost
})


// localhost:3000/books/is/12345ONE
app.get("/books/is/:isbn",(req,res)=>{   //    /path/:var_name . Here var_name represents the data that is requested . For Eg. in localhost we have to write /path/:12345ONE to get that book
    console.log(req.params)    
    const {isbn} = req.params;     //  const {var_name}=req.params is same as const variable_name = req.params.var_name (this is nothing but destructuring and res.params returns the object which is in form {var_name:"12345ONE"})     
    const getSpecificBook =db.books.filter((book)=>{
        if(book.ISBN === isbn)
            return book;
    })
    console.log(getSpecificBook)  // here getSpecificBook is an array of objs 
    console.log(getSpecificBook.length)
    if(getSpecificBook.length===0){
        return res.json({"error":`No Book found for the ISBN of ${isbn}`})
    }
    return res.json(getSpecificBook[0])
})

//    localhost:3000/books/book-category/tech   (here tech is one of the categories present in the category array of book object)
app.get("/books/book-category/:category",(req,res)=>{   
    const category = req.params.category;     
    let specificbook;
    const getSpecificBooks =db.books.filter((book) => book.category.includes(category) )
    if(getSpecificBooks.length===0){
        return res.json({"error":`No Book found for the category of ${category}`})
    }
    return res.json(getSpecificBooks)
})

// localhost:3000/authors
app.get("/authors",(req,res)=>{
    const getAllAuthors=db.authors;
    res.json(getAllAuthors);
})


//  localhost:3000/authors/id/1
app.get("/authors/id/:id",(req,res)=>{
    let id=req.params.id;
    id=Number(id);
    const getSpecificAuthor=db.authors.filter((author)=> author.id === id);
    if(getSpecificAuthor.length===0)
        return res.json({"error":`No Author found for id of ${id}`});
    return res.json(getSpecificAuthor[0]);
})


//  localhost:3000/authors/isbn/12345ONE
app.get("/authors/isbn/:isbn", (req,res)=>{
    const isbn = req.params.isbn;
    const getSpecificAuthor=db.authors.filter((author)=> author.books.includes(isbn));
    if(getSpecificAuthor.length===0)
        return res.json({"error":`No Author found for ISBN of ${isbn}`});
    return res.json(getSpecificAuthor);
})

//  localhost:3000/publications
app.get("/publications",(req,res)=>{
    const getAllPublications = db.publications;
    return res.json(getAllPublications);
})

//   localhost:3000/publications/isbn/12345ONE
app.get("/publications/isbn/:isbn",(req,res)=>{
    const isbn=req.params.isbn;
    const getSpecificPublications=db.publications.filter((publication)=> publication.books.includes(isbn))
    if(getSpecificPublications.length===0)
        return res.json({"error":`No Author found for ISBN of ${isbn}`});
    return res.json(getSpecificPublications);
})

//------------------------------------POST() method-----------------------------------------------------
//We are adding new data in this 

//  http://localhost:3000/book      (not books, it used in get())
app.post("/book", (req, res) => {
    console.log(typeof req.body);
    db.books.push(req.body);
    return res.json(db.books);
});

// http://localhost:3000/author 
app.post("/author", (req,res)=>{
    console.log(req.body)
    db.authors.push(req.body);
    return res.json(db.authors);
})

//  http://localhost:3000/publication
app.post("/publication",(req,res)=>{
    db.publications.push(req.body);
    return res.json(db.publications);
})

//  ===============================  PUT() mehtod =================
// We are editing existing data(not adding new ones)

//  http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", (req, res) => {
    console.log(req.body);
    console.log(req.params);
    const {isbn} = req.params;
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            console.log({...book, ...req.body})
            return {...book, ...req.body};
        }
        return book;
    })
    return res.json(db.books);
});

// localhost:3000/author-update/1
app.put("/author-update/:id", (req, res) => {
    const {id} = req.params;
    db.books.forEach((author) => {
        if(author.id === id) {
            console.log({...author, ...req.body})
            return {...author, ...req.body};
        }
        return author;
    })
    return res.json(db.authors);
});

// localhost:3000/publication-update/1
app.put("/publication-update/:id", (req, res) => {
    const {id} = req.params;
    db.publications.forEach((publication) => {
        if(publication.id === id) {
            console.log({...publication, ...req.body})
            return {...publication, ...req.body};
        }
        return publication;
    })
    return res.json(db.publications);
});

// --------------------------- DELETE() method -----------------
// localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn",(req,res)=>{
    const {isbn}= req.params;
    const afterDeleteBooks=db.books.filter((book)=>book.ISBN!==isbn)
    console.log(afterDeleteBooks)
    db.books=afterDeleteBooks;
    return res.json(db.books);
})

// localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id",(req,res)=>{
    let {isbn,id}= req.params;
    id=Number(id);
    db.books.forEach((book)=>
    {
        if(book.ISBN === isbn){
        if(!book.authors.includes(id)){
            return;
        }
        book.authors = book.authors.filter((author)=>author!==id);
        return book;
        }
        return book;
    })
    console.log(db.books);
    return res.json(db.books);
})

// localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:isbn/:id",(req,res)=>{
    let {id,isbn}= req.params;
    id=Number(id);
    db.books.forEach((book)=>
    {
        if(book.id === id){
        if(!authors.book.includes(id)){
            return;
        }
        book.authors = book.authors.filter((author)=>author!==id);
        return book;
        }
        return book;
    })
    console.log(db.books);
    return res.json(db.books);
})

app.listen(3000,()=>{
    console.log("My Express is running .............")
})



