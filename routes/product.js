const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../model/product');
const Category = require('../model/category');
const SubCategory = require('../model/subCategory');

// Get all products
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find()
        .populate('proCategoryId', 'name')
        .populate('proSubCategoryId', 'name');
    res.json({ success: true, message: "Products retrieved successfully.", data: products });
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('proCategoryId', 'name')
        .populate('proSubCategoryId', 'name');
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, message: "Product retrieved successfully.", data: product });
}));

// Create a new product
router.post('/', asyncHandler(async (req, res) => {
    const { name, price, description, stock, proCategoryId, proSubCategoryId, imageUrls, status } = req.body;

    if (!name || !price || !proCategoryId || !status) {
        return res.status(400).json({ success: false, message: "Name, price, category, and status are required." });
    }

    const newProduct = new Product({
        name,
        price,
        description: description || '',
        stock: stock || 0,
        proCategoryId,
        proSubCategoryId: proSubCategoryId || null,
        images: imageUrls || [], // array of Cloudinary URLs
        status
    });

    await newProduct.save();
    res.json({ success: true, message: "Product created successfully.", data: newProduct });
}));

// Update a product
router.put('/:id', asyncHandler(async (req, res) => {
    const { name, price, description, stock, proCategoryId, proSubCategoryId, imageUrls, status } = req.body;

    if (!name || !price || !proCategoryId || !status) {
        return res.status(400).json({ success: false, message: "Name, price, category, and status are required." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name,
            price,
            description: description || '',
            stock: stock || 0,
            proCategoryId,
            proSubCategoryId: proSubCategoryId || null,
            images: imageUrls || [],
            status
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, message: "Product updated successfully.", data: updatedProduct });
}));

// Delete a product
router.delete('/:id', asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, message: "Product deleted successfully." });
}));

module.exports = router;
