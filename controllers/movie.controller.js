const asyncHandler = require("../middlewares/async");
const Movie = require("../models/movie.model");

// @desc get all movie
// @route GET /api/movie
// @access public
exports.getAllMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find();
    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
    });
});

// @desc get single movie
// @route GET /api/movie/:id
// @access public
exports.getSingleMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return res.status(404).json({
            success: false,
            error: "Movie not found"
        });
    }
    res.status(200).json({
        success: true,
        data: movie
    });
});

// @desc create new movie 
// @route POST /api/movie
// @access private
exports.createMovie = asyncHandler(async (req, res) => {
    const { 
        title, 
        description, 
        release_year, 
        country, 
        language, 
        age_limit 
    } = req.body;

    if (!title || !description || !release_year) {
        return res.status(400).json({
            success: false,
            message: "title, description va release_year majburiy maydonlar!"
        });
    }

    const thumbnail = req.files?.thumbnail?.[0]?.path;
    const video = req.files?.video?.[0]?.path;

    if (!thumbnail || !video) {
        return res.status(400).json({
            success: false,
            message: "Thumbnail va video yuklash majburiy!"
        });
    }

    // Yangi film yaratish
    const movie = await Movie.create({
        title,
        description,
        release_year,
        country: country || "Uzbekistan",
        language: language || "Uzbek",
        age_limit: age_limit || "16+",
        thumbnail,
        video,
    });

    res.status(201).json({
        success: true,
        message: "Film muvaffaqiyatli qo'shildi!",
        data: movie
    });
});

// @desc update movie 
// @route PUT /api/movie/:id
// @access private
exports.updateMovie = asyncHandler(async (req, res) => {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
        return res.status(404).json({
            success: false,
            message: `ID bilan film topilmadi: ${req.params.id}`
        });
    }

    if (req.body.title) movie.title = req.body.title;
    if (req.body.description) movie.description = req.body.description;
    if (req.body.release_year) movie.release_year = req.body.release_year;
    if (req.body.country) movie.country = req.body.country;
    if (req.body.language) movie.language = req.body.language;
    if (req.body.age_limit) movie.age_limit = req.body.age_limit;

    if (req.files?.thumbnail?.[0]) {
        movie.thumbnail = req.files.thumbnail[0].path;
    }
    if (req.files?.video?.[0]) {
        movie.video = req.files.video[0].path;
    }

    await movie.save();

    res.status(200).json({
        success: true,
        message: "Film muvaffaqiyatli yangilandi!",
        data: movie
    });
});

// @desc delete movie 
// @route DELETE /api/movie/:id
// @access private
exports.deleteMovie = asyncHandler(async(req,res)=> {
    const {id} = req.params;

    if(!id) {
        return res.status(400).json({
            message: `Movie not found with id: ${id}`
        });
    }

    const movie = await Movie.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
        data: movie,
    });
});