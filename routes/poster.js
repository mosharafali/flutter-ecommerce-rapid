const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Poster = require('../model/poster');

// Get all posters
router.get('/', asyncHandler(async (req, res) => {
    const posters = await Poster.find();
    res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
}));

// Get poster by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const poster = await Poster.findById(req.params.id);
    if (!poster) return res.status(404).json({ success: false, message: "Poster not found." });
    res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
}));

// Create a new poster
router.post('/', asyncHandler(async (req, res) => {
    const { title, imageUrl, status } = req.body;

    if (!title || !imageUrl || !status) {
        return res.status(400).json({ success: false, message: "Title, image URL, and status are required." });
    }

    const newPoster = new Poster({
        title,
        image: imageUrl,
        status
    });

    await newPoster.save();
    res.json({ success: true, message: "Poster created successfully.", data: newPoster });
}));

// Update poster
router.put('/:id', asyncHandler(async (req, res) => {
    const { title, imageUrl, status } = req.body;

    if (!title || !imageUrl || !status) {
        return res.status(400).json({ success: false, message: "Title, image URL, and status are required." });
    }

    const updatedPoster = await Poster.findByIdAndUpdate(
        req.params.id,
        { title, image: imageUrl, status },
        { new: true }
    );

    if (!updatedPoster) return res.status(404).json({ success: false, message: "Poster not found." });
    res.json({ success: true, message: "Poster updated successfully.", data: updatedPoster });
}));

// Delete poster
router.delete('/:id', asyncHandler(async (req, res) => {
    const deletedPoster = await Poster.findByIdAndDelete(req.params.id);
    if (!deletedPoster) return res.status(404).json({ success: false, message: "Poster not found." });
    res.json({ success: true, message: "Poster deleted successfully." });
}));

module.exports = router;
