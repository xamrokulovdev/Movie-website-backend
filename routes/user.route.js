const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
} = require("../controllers/user.controller");

const {
    verifyToken,
    isAdmin,
} = require("../middlewares/auth");

// get all user 
router.get(
    "/", 
    verifyToken, 
    isAdmin,
    getAllUsers
);

// create user 
router.post(
    "/", 
    createUser
);

// login
router.post(
    "/login", 
    loginUser
);

// update user 
router.put(
    "/:id", 
    verifyToken, 
    updateUser
);

// delete user
router.delete(
    "/:id", 
    verifyToken, 
    isAdmin, 
    deleteUser
);

module.exports = router;