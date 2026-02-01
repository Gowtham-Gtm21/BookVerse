const usermodel = require("../models/Users");

// get user in user admin seller

//c-get add,delete update

const getUser = async (req, res) => {
  try {
    const role =req.params.role;
    
    const allUser = await usermodel.find({role});
    
    if (allUser.length != 0) {
      return res.status(200).json({ allUser });
      
    }
    return res.status(400).json({ msg: "not able get user" });
  } catch (error) {
    return res.status(500).json({ msg: `Error : ${error}` });
  }
};

const getUserById = async (req, res) => {
  try {
    const User = await usermodel.findOne({ _id: req.params.id });
    if (!User) {
     return  res.status(400).json({ msg: "not able get user" });
     
    }
    return res.status(200).json({ User });
  } catch (error) {
    return res.status(500).json({ msg: `Error : ${error}` });
  }
};

// const addUser = async (req, res) => {
//   try {
//     const { name, password, email, role } = req.body;
//     const exists = await usermodel.findOne({ email:email});
//     if (exists) {
//       res.status(400).json({ msg: "user already exists" });
//       return;
//     }
//     const newUser = await usermodel.create({ name, password, email, role });
//     res.status(200).json({ msg: "user successfully created", newUser });
//   } catch (error) {
//     res.status(500).json({ msg: `Error : ${error}` });
//   }
// };
const updateUser = async (req, res) => {
  try {
    const  id  = req.params.id;
    const exists = await usermodel.findOne({ _id: id });
    if (exists) {
      const updatedUser = await usermodel.updateOne({ _id: id }, req.body, {
        new: true,
      });
     return  res.status(200).json({ msg: "updated", updatedUser });
    }
    return res.status(400).json({ msg: "not able update user" });
  } catch (error) {
   return  res.status(500).json({ msg: `Error : ${error}` });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const exists = await usermodel.findOne({ _id: id });
    if (exists) {
      const result = await usermodel.deleteOne({ _id: id });
     return  res.status(200).json({ result });
    }
   return  res.status(400).json({ msg: "not able get user" });
  } catch (error) {
   return  res.status(500).json({ msg: `Error : ${error}` });
  }
};

const userController = {getUserById, getUser, updateUser, deleteUser };// addUser,
module.exports = userController;
