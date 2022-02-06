const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

const generalTools = {};

generalTools.getUserFromJWT = (req) => {
    const TOKEN = req.headers.authorization.split(' ')[1];
    return jwt.decode(TOKEN);
}



generalTools.JWTDecode = (token) => {
    const TOKEN = token.split(' ')[1];
    return jwt.decode(TOKEN);
}


generalTools.optimizer = (object, elements) => {
    for (let i = 0; i < elements.length; i++) {
        delete object[elements[i]];
    };
    return object;
}

generalTools.createToken = (user, expiresIn) => {

    return jwt.sign({
        user: user
    }, config.secret, {
        expiresIn: expiresIn
    });
};


generalTools.createResetPasswordToken = (user, expiresIn) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        tokenCreationDate: Date.now()

    }, config.secret, {
        expiresIn: expiresIn
    });
};


generalTools.trimObjectValues = (object) => {
    for (const key in object) {
        typeof (object[key]) === 'string' ? object[key] = object[key].trim(): null;
    };
    return object;
};


generalTools.deleteUnEditableValues = (object, unEditable) => {
    for (const element in unEditable) {
        delete object[unEditable[element]]
    };
    return object;
};


generalTools.isEmptyObject = (object) => {
    for (var prop in object) {
        if (Object.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(object) === JSON.stringify({});
}

generalTools.checkURLValidate = (url) => {
    return "/^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#]\\S*)?$/i".test(url);
}

module.exports = generalTools;