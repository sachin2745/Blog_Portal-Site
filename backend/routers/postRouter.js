const express = require('express');
const router = express.Router();
const Model = require('../model/postModel');
const verifyToken = require('./verifyToken');

// Add a new post
router.post('/add', verifyToken, (req, res) => {
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get all posts
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get a post by ID
router.get("/getbyid/:id", (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
});

// Get posts by category
router.get("/getbycategory/:category", (req, res) => {
    Model.find({ category: req.params.category })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get recent posts
router.get('/getposts', (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not specified
    Model.find().sort({ createdAt: -1 }).limit(limit)
        .then((result) => {
            res.status(200).json({ posts: result });
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete a post by ID
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update a post by ID
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
