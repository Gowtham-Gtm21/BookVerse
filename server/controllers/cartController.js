const cartmodel =require("../models/Carts");

const Bookmodel = require("../models/Books");



const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    const book = await Bookmodel.findById(bookId);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    
    let cart = await cartmodel.findOne({ userId });

    if (!cart) {
      cart = new cartmodel({
        userId,
        items: [
          {
            bookId: book._id,
            title: book.title,
            author: book.author,
            category: book.category,
            image: book.image,
            quantity: quantity || 1,
            price: book.price,
          },
        ],
        totalPrice: book.price * (quantity || 1),
      });

      await cart.save();
      return res.status(200).json({ msg: "Book added to cart", cart });
    }

   
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
     
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
     
      cart.items.push({
        bookId: book._id,
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image,
        quantity: quantity || 1,
        price: book.price,
      });
    }

  
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
if (cart.items.length === 0) {
      cart.totalPrice = 0;
    }
    cart.updatedAt = Date.now();
    await cart.save();

   return  res.status(200).json({ msg: "Cart updated", cart });
  } catch (err) {
   return  res.status(500).json({ msg: err.message });
  }
};



const getcartItems = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await cartmodel.findOne({ userId:userId });


    if (!cart) {
      return res.status(200).json({ 
        cart: { items: [], totalPrice: 0 }
      });
    }
    // Ensure every item has an absolute image URL. If image missing, try to load from Book model.
    const preparedItems = [];
    for (const it of cart.items) {
      let image = it.image;
      if (!image) {
        try {
          const b = await Bookmodel.findById(it.bookId);
          image = b ? b.image : null;
        } catch (e) {
          image = null;
        }
      }

      if (image && !image.startsWith("http://") && !image.startsWith("https://")) {
        const hostBase = `${req.protocol}://${req.get('host')}`;
        if (image.startsWith("/uploads")) image = `${hostBase}${image}`;
        else if (image.startsWith("uploads/")) image = `${hostBase}/${image}`;
        else if (image.startsWith("/")) image = `${hostBase}${image}`;
        else image = `${hostBase}/uploads/${image}`;
      }

      preparedItems.push({ ...it.toObject(), image });
    }

    const responseCart = { ...cart.toObject(), items: preparedItems };
    return res.status(200).json({ cart: responseCart });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteItem= async (req,res)=>{
  try {
    const { id, bookId } = req.params;
  
    const result = await cartmodel.findOneAndUpdate(
      { userId: id },
      { $pull: { items: { _id: bookId } } },
      { new: true }
    );
    
    if(!result){
      return res.status(500).json({msg:"Not able to delete"})
      
    }
    return res.status(200).json({msg:"successfully deleted !"})

  } catch (error) {
    return res.status(500).json({msg:`error :${error}`})

  }
}



const cartController={addToCart,getcartItems,deleteItem}
module.exports=cartController;