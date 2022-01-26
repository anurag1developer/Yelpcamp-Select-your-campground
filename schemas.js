const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


// This Error is caused because name attribute of title in edit form of
// campground has an extra space 
// [Object: null prototype] {
//     campground: [Object: null prototype] {
//       title: 'bhoot',
//       location: 'shutup',
//       price: '23',
//       description: 'i'
//     }
//   }

//   [Object: null prototype] {
//     'campground[title] ': 'bhoot',
//     campground: [Object: null prototype] {
//       location: 'shutup',
//       price: '23',
//       description: 'i'
//     }
//   }




