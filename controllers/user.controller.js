const asyncHandler = require("../middlewares/async");
const User = require("../models/user.model");

// @desc get all user 
// @route GET /api/v1/user
// @access private
exports.getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
})

// @desc create user 
// @route POST /api/v1/user
// @access private
exports.createUser = asyncHandler(async(req, res) => {
    const {
        fullname,
        email,
        password,
        gender,
    } = req.body;

    if(
        !fullname ||
        !email ||
        !password ||
        !gender
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });
    }

    const user = await User.create({
        fullname,
        email,
        password,
        gender,
    });

    res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully",
    });
});

// @desc update user
// route PUT /api/v1/user/:id
// access private
exports.updateUser = asyncHandler(async(req, res) => {
    let user = await User.findById(req.params.id);

    if(!user) {
        return res.status(404).json({
            success: false,
            message: `ID bilan foydalanuvchi topilmadi: ${req.params.id}`
        });
    }

    if(req.body.fullname) user.fullname = req.body.fullname;
    if(req.body.email) user.email = req.body.email;
    if(req.body.password) user.password = req.body.password;
    if(req.body.gender) user.gender = req.body.gender;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
        data: user,
    });
});

// @desc delete user
// @route DELETE /api/v1/user/:id
// @access private
exports.deleteUser = asyncHandler(async(req, res) => {
    const {id} = req.params;

    if(!id) {
        return res.status(400).json({
            message: `Foydalanuvchi topilmadi: ${id}`
        });
    }

    const user = await User.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli o'chirildi!",
        data: user,
    });
});