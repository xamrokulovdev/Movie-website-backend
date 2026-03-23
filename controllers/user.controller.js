const asyncHandler = require("../middlewares/async");
const User = require("../models/user.model");


// @desc get all users
// @route GET /api/v1/user
// @access private
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});


// @desc create user (register)
// @route POST /api/v1/user
// @access public
exports.createUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, gender } = req.body;

    if (!fullname || !email || !password || !gender) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });
    }

    // check email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Bu email allaqachon mavjud!",
        });
    }

    let role = "user";
    if (
        fullname === process.env.ADMIN_FULLNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        role = "admin";
    }

    const user = await User.create({
        fullname,
        email,
        password,
        gender,
        role,
    });

    const token = user.getSignedJwtToken();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
        success: true,
        token,
        data: userObj,
        message: `User created successfully with role: ${role}`,
    });
});


// @desc login user
// @route POST /api/v1/user/login
// @access public
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email va parol kiriting!",
        });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User topilmadi",
        });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Parol noto‘g‘ri",
        });
    }

    const token = user.getSignedJwtToken();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
        success: true,
        token,
        data: userObj,
    });
});


// @desc update user
// @route PUT /api/v1/user/:id
// @access private
exports.updateUser = asyncHandler(async (req, res) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `Foydalanuvchi topilmadi: ${req.params.id}`,
        });
    }

    // update fields
    if (req.body.fullname) user.fullname = req.body.fullname;
    if (req.body.email) user.email = req.body.email;
    if (req.body.gender) user.gender = req.body.gender;

    // password (hash bo‘ladi pre-save orqali)
    if (req.body.password) {
        user.password = req.body.password;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
        data: userObj,
    });
});


// @desc delete user
// @route DELETE /api/v1/user/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `Foydalanuvchi topilmadi: ${id}`,
        });
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli o‘chirildi!",
    });
});