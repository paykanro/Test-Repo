const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    Name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 40
    },
    mobileNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 80
    },
    role: {
        type: String,
        required: true,
        default: 'client',
        enum: ['superAdmin', 'client']
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    lastUpdate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    profilePicture:{
        type: String        
    },
    about: {
        type: String
    },
    facebook: {
        type:String
    },
    twitter: {
        type:String
    },
    instagram: {
        type:String
    },
    linkedIn: {
        type:String
    }
});

UserSchema.pre('save', async function (next) {
    try {
        //Manage Password Encryption
        var user = this;
        if (this.isModified('password') || this.isNew) {
            let salt = bcrypt.genSaltSync(10);
            let hashedPassword = bcrypt.hashSync(user.password, salt);
            user.password = hashedPassword;
   
        } else {return next();}
    } catch (err) {
        throw err;
    }
});

UserSchema.post('init', function (doc) {
    let selectedDoc = this;
    selectedDoc.id = selectedDoc._id;
});




UserSchema.pre(['update', 'findOneAndUpdate', 'upsert'], function () {
    this.update({}, {
        $set: {lastUpdate: Date.now()}
    });
});



UserSchema.methods.comparePassword = function (pass) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, this.password, function (err, isMatch) {
            if (err) {return reject(err);};
            resolve(isMatch);
        });
    });
};

module.exports = mongoose.model('user', UserSchema);