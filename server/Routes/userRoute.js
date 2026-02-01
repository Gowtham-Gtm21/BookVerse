

const express=require("express");
const userController =require("../controllers/userController")
const userRouter=express.Router();
const {protect} =require("../middleware/authmiddleware");
const {allowRoles} =require("../middleware/authrole");
const authUser =require("../controllers/authController");


userRouter.get("/get-user/:role",protect,allowRoles("admin"),userController.getUser);
userRouter.get("/get-userById/:id",protect,allowRoles("buyer","seller","admin"),userController.getUserById);
userRouter.post("/register",authUser.register);
userRouter.post("/login",authUser.login);
userRouter.patch("/update-user/:id",protect,allowRoles("buyer","seller","admin"),userController.updateUser);
userRouter.delete("/delete-user/:id",protect,allowRoles("admin"),userController.deleteUser);


module.exports=userRouter;