const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlLinkSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type : Schema.Types.ObjectId,
        ref : 'category',
        required : true
    },
    title:{
        type: String
    },
    originalURL: {
        type: String,
        required: true
    },
    shortenedURL: {
        type : String,
        unique : true
    },
    qrCode: {
        type: String
    },
    expiration : {
        type: Date,
        required: true,
        default : function() { return new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); }
    },
    click:{
        type: Number,
        default: 0
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

UrlLinkSchema.post('init', function (doc) {
    let selectedDoc = this;
    selectedDoc.id = selectedDoc._id;
});

module.exports = mongoose.model('UrlLink', UrlLinkSchema);