const express =require("express");
const cartcontroller =require("../controllers/cartController");

const {protect} =require("../middleware/authmiddleware.js");
const {allowRoles} =require("../middleware/authrole");
const cartController = require("../controllers/cartController");

const cartRouter = express.Router();



cartRouter.post("/addcart",protect,allowRoles("buyer"),cartcontroller.addToCart);
cartRouter.get("/get-cart/:id",protect,allowRoles("buyer"),cartcontroller.getcartItems);
cartRouter.delete("/deleteCart/:id/:bookId",protect,allowRoles("buyer"),cartController.deleteItem);
module.exports=cartRouter;