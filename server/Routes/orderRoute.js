const express=require("express");
const orderController=require("../controllers/orderController");
const {protect} =require("../middleware/authmiddleware");
const {allowRoles} =require("../middleware/authrole");

const orderRouter =express.Router();


orderRouter.post("/my-orders",protect,allowRoles("buyer"),orderController.placeOrder);
orderRouter.get("/get-order/:id",protect,allowRoles("buyer","admin"),orderController.myOrders);
orderRouter.delete("/delete-order/:id", protect, allowRoles("buyer","admin"), orderController.deleteOrder);


module.exports=orderRouter;