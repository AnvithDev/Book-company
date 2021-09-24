// Main Backend file

const db = require("./database/index.js") //get the index.js file
// console.log(db);
// console.log(db.books)                  
// console.log(db.authors)                  
// console.log(db.publications)

const express=require("express"); //gets the express framework(is used everytime the express framework is needed)
const app=express();
app.use(express.json());

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

app.listen(3000,()=>{
    console.log("My Express is running .............")
})



