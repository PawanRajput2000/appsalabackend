const mongoose = require('mongoose');

// Create the App schema
const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    shortname: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true

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
        },
        duration: {
            value: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                enum: ['week', 'month', 'year'],
                required: true
            }
        }
        // lite ,standard ,premium  description
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
