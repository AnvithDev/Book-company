// Main Backend file

const db = require("./database/index.js") //get the index.js file
console.log(db);
console.log(db.books)                  
console.log(db.authors)                  
console.log(db.publications)

const express=require("express") //gets the express framework(is used everytime the express framework is needed)
const app=express();

app.get("/", (req,res) =>{
    const getAllBooks = db.books;
    return res.json(getAllBooks)  //res.json() sends the js object in json format to the localhost
})

app.get("/is/:isbn",(req,res)=>{   //    /path/:var_name . Here var_name represents the data that is requested . For Eg. in localhost we have to write /path/:12345ONE to get that book
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

app.listen(3000,()=>{
    console.log("My Express is running .............")
})



