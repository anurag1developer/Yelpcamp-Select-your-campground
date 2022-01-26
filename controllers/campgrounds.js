const Campground = require('../models/campground')
const ObjectID = require('mongoose').Types.ObjectId;
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    // const camp = new Campground({ title: 'My Backyard', description: 'cheap camping!' });
    // await camp.save();
    // res.send(camp)
    const campgrounds = await Campground.find({});
    // console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    // console.log(req.body.campground);
    // someone could add campground through postman  
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(campground.images);
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find campground with that id');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    // console.log(campground);
    // this error may never work because above id error will work 
    // campground id is valid but campground is not found so this error will work
    if (!campground) {
        req.flash('error', "Cannot find that campground!");
        // console.log('campground id is valid but campground is not found so this error will work')
        return res.redirect('/campgrounds');
    }
    // console.log(campground);
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Id is Invalid: There is no existing campground with that id.')
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'There is no existing campground with that id, so editing is not possible');
        return res.redirect('/campgrounds');
    }
    // console.log('Before Edit');
    // console.log(campground);
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    // res.send('It worked!!');
    // console.log(req.params.id);
    // console.log(req.params)
    // console.log({ ...req.body.campground });
    const { id } = req.params;
    // console.log(req.body);
    if (!ObjectID.isValid(id)) {
        req.flash('error', "You can't update a campground with that invalid id.");
        return res.redirect('/campgrounds');
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!camp) {
        req.flash('error', "No campground found!");
        return res.redirect('/campgrounds');
    }
    // console.log('After Edit Form');
    // console.log(camp);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            // await cloudinary.uploader.destroy(filename);
            cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // console.log(camp);
    }
    // console.log('After Edit');
    // console.log(camp);
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.destroyCampground = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', "Campground with this id doesn't exist");
        res.redirect('/campgrounds')
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Campground doesn't exist");
        return res.redirect('/campgrounds');
    }
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log(deletedCampground);
    if (deletedCampground) {
        req.flash('success', 'Successfully deleted a campground');
    }
    res.redirect('/campgrounds');
};