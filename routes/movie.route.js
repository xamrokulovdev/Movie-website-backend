const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movie.controller");

const {
  verifyToken,
  isAdmin
} = require("../middlewares/auth");

const upload = require("../utils/upload");

// get all movies
router.get("/", getAllMovies);

// get single movie
router.get(
  "/:id", 
  verifyToken, 
  isAdmin, 
  getSingleMovie
);

// create movie
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createMovie
);

// update movie
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateMovie
);

// delete movie
router.delete(
  "/:id", 
  verifyToken, 
  isAdmin, 
  deleteMovie
);

module.exports = router;