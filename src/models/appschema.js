const mongoose = require('mongoose');

// Create the App schema
const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique :true
    },
    shortname: {
        type: String,
        required: true,
        unique :true
    },
    rating: {
        Usability: Number,
        Perfomance: Number,
        Features: Number,
        Support: Number,
        Value: Number,
        Company: Number,
    },
    logo: {
        type: String,
       
    },
    tag: {
        type: [String],
        required: true
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },

    review: String,

    sellerDetails: {
        seller: {
            type: String,
            required: true
        },
        Website: {
            type: String,
            required: true
        },
        companyWebsite: {
            type: String,
            required: true
        },
        yearFounded: {
            type: Number,
            required: true
        },
        HQLocation: {
            type: String,
            required: true
        },
        socialmedia: {
            twitter: {
                type: String,

            },
            linkedInPage: {
                type: String,
            }
        }
    },
    appPricing: [{
        name: {
            type: String
        },
        price: {
            type: Number
        },
        description: {
            type: String
        }
    }],
    appMedia: {
        officialScreenshots: {
            type: [String],

        },
        officialVideos: {
            type: [String],

        },
        officialDownloads: {
            type: [String],

        }
    }
});

// Create the App model
const App = mongoose.model('App', appSchema);

module.exports = App;
