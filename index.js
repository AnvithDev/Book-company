// Main Backend file
require('dotenv').config(); //This is to access .env file

const db = require("./database/index.js") //get the index.js file
const BookModel = require("./Database/books")
const AuthorModel = require("./Database/authors")
const PublicationModel = require("./Database/publications")

const express=require("express"); //gets the express framework(is used everytime the express framework is needed)
const app=express();
app.use(express.json());

//Import the mongoose module
var mongoose = require('mongoose');


// code from MongoDB itself
// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://Anvith_Dev:KqWfh8Is7Npg9gDV@cluster0.s7szx.mongodb.net/BOOK-COMPANY?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// // console.log(client)
// client.connect(err => {
//   const book_collection = client.db("BOOK-COMPANY").collection("books").findOne({ISBN:"1234Three"});  //findOne() is an method from MongoDB
//   book_collection.then((data)=>console.log(data)).catch((err)=>console.log(err));
//   // perform actions on the collection object
// });
// client.close();

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

// =========================  Efficient Method =================
//Set up default mongoose connection
var mongoDB = process.env.MONGODB_URI;  // This is used to access MONGODB_URI variable in .env file (This is mainly used for security purpose)
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED"));

//   localhost:3000/
app.get("/",(req,res)=>{
    res.json({"Welcome_msg":"WELCOME TO MY BOOK MANAGEMENT BACKEND!!!!!!!!!!!"})
})

//   localhost:3000/books
app.get("/books", async (req,res) =>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks)  
})


// localhost:3000/books/is/12345ONE
app.get("/books/is/:isbn",async (req,res)=>{   
    console.log(req.params)    
    const {isbn} = req.params;     //  const {var_name}=req.params is same as const variable_name = req.params.var_name (this is nothing but destructuring and res.params returns the object which is in form {var_name:"12345ONE"})     
    const getSpecificBook = await BookModel.findOne({ISBN:isbn})
    console.log(getSpecificBook)  // here getSpecificBook is an array of objs 
    if(getSpecificBook.length===null){
        return res.json({"error":`No Book found for the ISBN of ${isbn}`})
    }
    return res.json(getSpecificBook)
})

//    localhost:3000/books/book-category/tech   (here tech is one of the categories present in the category array of book object)
app.get("/books/book-category/:category",async (req,res)=>{   
    const category = req.params.category;     
    const getSpecificBooks = await BookModel.find({category:category});
    if(getSpecificBooks.length===0){
        return res.json({"error":`No Book found for the category of ${category}`})
    }
    return res.json(getSpecificBooks)
})

// localhost:3000/authors
app.get("/authors",async (req,res)=>{
    const getAllAuthors=await AuthorModel.find();
    res.json(getAllAuthors);
})


//  localhost:3000/authors/id/1
app.get("/authors/id/:id",async (req,res)=>{
    let {id}=req.params;
    id=Number(id);
    const getSpecificAuthor=await AuthorModel.findOne({id:id})
    if(getSpecificAuthor.length===0)
    return res.json({"error":`No Author found for id of ${id}`});
    return res.json(getSpecificAuthor[0]);
})


//  localhost:3000/authors/isbn/12345ONE
app.get("/authors/isbn/:isbn",async (req,res)=>{
    const isbn = req.params.isbn;
    const getSpecificAuthors=await AuthorModel.find({books:isbn});
    if(getSpecificAuthors.length===0)
        return res.json({"error":`No Author found for ISBN of ${isbn}`});
    return res.json(getSpecificAuthors);
})

//  localhost:3000/publications
app.get("/publications",async (req,res)=>{
    const getAllPublications =await PublicationModel.find();
    return res.json(getAllPublications);
})

//   localhost:3000/publications/isbn/12345ONE
app.get("/publications/isbn/:isbn",async (req,res)=>{
    const isbn=req.params.isbn;
    const getSpecificPublications=await PublicationModel.find({books:isbn})
    if(getSpecificPublications.length===0)
        return res.json({"error":`No Publication found for ISBN of ${isbn}`});
    return res.json(getSpecificPublications);
})

//------------------------------------POST() method-----------------------------------------------------
//We are adding new data in this 

//  http://localhost:3000/book      (not books, it used in get())
app.post("/book", async (req, res) => {
    console.log(typeof req.body);
    const addNewBook = await BookModel.create(req.body);
    console.log(addNewBook);
    res.json({
        book:addNewBook,
        message:"Book was Added !! Yay!!!!!"
    }) 
});

// http://localhost:3000/author 
app.post("/author",async (req,res)=>{
    console.log(typeof req.body)
    const addNewAuthor= await AuthorModel.create(req.body);
    console.log(addNewAuthor);
    res.json({
        author:addNewAuthor,
        message:"Author was Added Yay!!!!!!!"
    })
})

//  http://localhost:3000/publication
app.post("/publication",async (req,res)=>{
    const addNewPublication= await PublicationModel.create(req.body);
    return res.json({
        publication:addNewPublication,
        message:"New Publication Added Yay!!!!!!!"
    });
})

//  ===============================  PUT() mehtod =================
// We are editing existing data(not adding new ones)

//  http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn} = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN:isbn}, req.body , {new:true});
    return res.json( {bookUpdated: updateBook , message:"Book was updated !!!"} );   
});

// localhost:3000/author-update/1
app.put("/author-update/:id",async (req, res) => {
    let {id} = req.params;
    id=Number(id);
    const updateAuthor = await AuthorModel.findOneAndUpdate({id:id},req.body,{new:true});
    return res.json({
        authorUpdated:updateAuthor,
        message:"Author was updated!!!!!!!"
    });
});

// localhost:3000/publication-update/1
app.put("/publication-update/:id",async(req, res) => {
    let {id} = req.params;
    id=Number(id);
    const updatePublication = await PublicationModel.findOneAndUpdate({id:id},req.body,{new:true});
    return res.json({
        publicationUpdated:updatePublication,
        message:"Publication was updated!!!!!!!"
    });
});

// --------------------------- DELETE() method -----------------
// localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn",async (req,res)=>{
    const {isbn} = req.params;
    const deletedBook = await BookModel.deleteOne({ISBN:isbn});
    return res.json( {bookDeleted: deletedBook , message:"Book was Deleted!!!"} ); 
})

// localhost:3000/book-author-delete/12One/1
app.delete("/book-author-delete/:isbn/:id",async(req,res)=>{
    let {isbn,id}= req.params;
    // id=Number(id);   // this is not required bcoz mongodb
    let getSpecificBook = await BookModel.findOne({ISBN:isbn});
    if(getSpecificBook===null){
        return res.json({"error":`No book exits for ISBN Of ${isbn}`})
    }
    else{
        getSpecificBook.authors.remove(id);
        const update_book= await BookModel.findOneAndUpdate({ISBN:isbn},getSpecificBook,{new:true});
    }
    return res.json(
        {
            updatedBook : update_book,
            message:"Author has been deleted from the book!!!!!"
    })
})

// localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn",async(req,res)=>{
    let {id,isbn}= req.params;
    // id=Number(id);   // this is not required bcoz mongodb takes care of it
    let getSpecificAuthor = await AuthorModel.findOne({id:id});
    if(getSpecificAuthor===null){
        return res.json({"error":`No author exits for id Of ${id}`})
    }
    else{
        getSpecificAuhtor.books.remove(isbn);
        const update_author= await AuthorModel.findOneAndUpdate({id:id},getSpecificAuthor,{new:true});
    }
    return res.json(
        {
            updatedAuthor: update_author,
            message:"Book has been deleted from the Author!!!!!"
    })
})

// localhost:3000/author-delete/1
app.delete("/author-delete/:id",async (req,res)=>{
    let {id}= req.params;
    id=Number(id);
    const deletedAuthor = await AuthorModel.deleteOne({id:id});
    return res.json({
        authorDeleted:deletedAuthor,
        message:"Author was deleted!!!!!"
    });
})

// localhost:3000/publication-delete/1
app.delete("/publication-delete/:id",async (req,res)=>{
    let {id}= req.params;
    id=Number(id);
    const deletedPublication = await PublicationModel.deleteOne({id:id});
    return res.json({
        publicationDeleted:deletedPublication,
        message:"Publication was deleted!!!!!"
    });
})

app.listen(3000,()=>{
    console.log("My Express is running .............")
})



