const express=require("express");
const bookController=require("../controllers/bookController");
const uploads=require("../utils/upload")

const {protect} =require("../middleware/authmiddleware");
const {allowRoles} =require("../middleware/authrole");

const bookRouter=express.Router();


bookRouter.get("/get-book",protect,allowRoles("buyer","seller","admin"),bookController.getBook);
bookRouter.get("/getId-book/:id",protect,allowRoles("buyer","seller","admin"),bookController.getBookById);
bookRouter.post("/add-book",protect,allowRoles("seller","admin"),uploads.single("image"),bookController.createBook);
bookRouter.get("/search/:author",protect,allowRoles("buyer","seller","admin"),bookController.searchByAuthor);
bookRouter.delete("/delete-book/:id",protect,allowRoles("seller","admin"),bookController.deleteBook);
bookRouter.get("/my-products/:sellerId",protect,allowRoles("seller"), bookController.getMyProducts);
bookRouter.get("/seller/stats/:id",protect,allowRoles("seller"),bookController.getBookBysell);
bookRouter.get("/seller-order/:id",protect,allowRoles("seller"),bookController.getBookOrders);



module.exports=bookRouter;
