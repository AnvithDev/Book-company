var books = [
    {
      ISBN: "12345ONE",
      title: "Getting started with MERN",
      authors: [1, 2],
      language: "en",
      pubDate: "2021-07-07",
      numOfPage: 225,
      category: ["fiction", "programming", "tech", "web dev"],
      publication: 1
    },
    {
      ISBN: "12345Two",
      title: "Getting started with Python",
      authors: [1, 2],
      language: "en",
      pubDate: "2021-07-07",
      numOfPage: 342,
      category: ["fiction", "tech", "web dev"],
      publication: 1
    }
  ];
  
  var authors = [
    {
      id: 1,
      name: "nikhil",
      books: ["12345ONE", "12345Two"]
    },
    {
      id: 2,
      name: "ram",
      books: ["12345ONE", "12345Two"]
    }
  ];
  
  let publications = [
    {
      id: 1,
      name: "ShapeAI Publications",
      books: ["12345ONE" , "12345Two"]
    },
    {
      id: 2,
      name: "Agarwal Publications",
      books: []
    }
  ];
  
  module.exports = {books,authors,publications};