const mongoose = require('mongoose');

const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    // console.log('Before');
    // console.log(this.url);
    return this.url.replace('/upload', '/upload/w_200')
    // console.log('After');
    // console.log(this.url);
    // console.log(this.thumbnail);
    // if i call img.thumbnail it gives error multiple stack 
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: {
        type: Number
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log('Deleted');
    // console.log(doc)
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);