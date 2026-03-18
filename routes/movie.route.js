const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movie.controller");

const upload = require("../utils/upload");

// get all movies
router.get("/", getAllMovies);

// get single movie
router.get("/:id", getSingleMovie);

// create movie (thumbnail + video)
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createMovie
);

// update movie (thumbnail + video optional)
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateMovie
);

// delete movie
router.delete("/:id", deleteMovie);

module.exports = router;