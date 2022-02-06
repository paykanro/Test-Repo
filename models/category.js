const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CetegorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

CetegorySchema.post('init', function (doc) {
    let selectedDoc = this;
    selectedDoc.id = selectedDoc._id;
});

module.exports = mongoose.model('category', CetegorySchema);