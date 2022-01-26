const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary/index');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// .post(upload.single('image'), (req, res) => {
//     console.log(req.body, req.file);
//     res.send('It Worked!');
// })
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('It Worked!');
// })

// NEW 
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

// EDIT 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// // Long way 
// router.get('/', catchAsync(campgrounds.index));

// // NEW 
// router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// // POST 
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// // SHOW 
// router.get('/:id', catchAsync(campgrounds.showCampground));

// // EDIT 
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// // UPDATE 
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// // DELETE 
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));

module.exports = router;