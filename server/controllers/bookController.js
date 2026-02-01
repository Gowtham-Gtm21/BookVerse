const bookmodel = require("../models/Books");
const ordermodel= require("../models/Orders");

const getBook = async (req, res) => {
  try {
    const allbook = await bookmodel.find();

     const updatedBooks = allbook.map(book => {
      let imageUrl = book.image;

      if (!imageUrl.startsWith("http")) {
        imageUrl = `http://localhost:8080/uploads/${imageUrl}`;
      }

      return {
        ...book._doc,
        image: imageUrl
      };
    });

    return res.status(200).json({ allbook: updatedBooks });

  } catch (error) {
   return res.status(500).json({ msg: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    let { title, author,price,category,stock,description } = req.body;

    const exists = await bookmodel.findOne({ author, title });
    if (exists) {
     return res.status(400).json({ msg: "book already exists" });
     
    }
    const addBook = await bookmodel.create({title, author,price,category,stock,description,image: req.file?.filename || null,sellerId: req.body.sellerId});
   return res.status(200).json({ msg: "book added successfully", addBook });
  } catch (error) {
   return res.status(500).json({ msg: `${error.message}` });
  }
};


const getBookById = async (req, res) => {
  try {
    const getbook = await bookmodel.findOne({ _id: req.params.id });
    
   return  res.status(200).json({ getbook });
  } catch (error) {
    return res.status(500).json({ msg: `${error.message}` });
  }
};

// const updateBook = async (req, res) => {
//   try {
    
//     const exists = await bookmodel.findOne({ _id: req.params.id } );
    
//     if (exists) {
//         const addBook = await bookmodel.updateOne({ _id: req.params.id },req.body,{new:true});
//         res.status(200).json({ msg: "book updated successfully", addBook });
//         return;
//     }
//     res.status(400).json({ msg: "book already exists" });
//   } catch (error) {
//     res.status(500).json({ msg: `${error.message}` });
//   }
// };
const searchByAuthor = async (req, res) => {
  try {
    const author  = req.params.author;

    if (!author || author.trim() === "") {
      return res.status(400).json({ msg: "Author name is required" });
    }

    // Case-insensitive partial search
    const books = await bookmodel.find({
      author
    });

    if (books.length === 0) {
      return res.status(404).json({ msg: "No books found for this author" });
    }

   return  res.status(200).json({ msg: "Books found", books });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


const deleteBook =async(req,res)=>{
    try {
        const exists = await bookmodel.findOne({ _id: req.params.id } );
       
        if(exists){
            let result =await bookmodel.deleteOne({_id:req.params.id});
            
            
            return res.status(200).json({msg:"successfully delelted",result})
            
        }
       return  res.status(400).json({msg:"book not exists"})
    } catch (error) {
       return  res.status(500).json({msg:`${error}`})
    }
}

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const books = await bookmodel.find({ sellerId });
         const updatedBooks = books.map(book => {
      let imageUrl = book.image;

      if (!imageUrl.startsWith("http")) {
        imageUrl = `http://localhost:8080/uploads/${imageUrl}`;
      }

      return {
        ...book._doc,
        image: imageUrl
      };
    });

    return res.status(200).send({ books:updatedBooks });
  } catch (err) {
    return res.status(500).send({ msg: "Server error", err });
  }
};


const getBookBysell=async(req,res)=>{
  try {
    const  sellerId  = req.params.id;

    const books = await bookmodel.find({ sellerId:sellerId });

    const result = [];

    for (let book of books) {
      const orderCount = await ordermodel.countDocuments({  bookId: book._id });
      result.push({
        title: book.title,
        orders: orderCount,
      
      });
    }

    return res.status(200).json({result});

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


const getBookOrders = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // 1. Get all books of this seller
    const books = await bookmodel.find({ sellerId });

    if (!books.length) {
      return res.status(200).json({ result: [] });
    }

    // Extract book IDs from book array
    const bookIds = books.map((b) => b._id);

    // 2. Find all orders where bookId matches seller books
    const orders = await ordermodel.find({ bookId: { $in: bookIds } });

    return res.status(200).json({ result: orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



const bookController = { getBook,getBookBysell, getBookOrders,createBook,searchByAuthor,getBookById,deleteBook,getMyProducts}; //,updateBook 
module.exports = bookController;
//