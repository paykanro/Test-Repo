const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

refreshTokenSchema.post('init', function (doc) {
    let selectedDoc = this;
    selectedDoc.id = selectedDoc._id;
});


module.exports = mongoose.model('refreshToken', refreshTokenSchema);