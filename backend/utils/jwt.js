const { expressjwt: jwt } = require("express-jwt");
const userService = require('../users/user.service');

function jwtCheck() {
    const secret = process.env.MONGODB_SECRET;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked
    }).unless({
        path: [
            '/users/authenticate',
            '/users/register',
            '/users/enroll',
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.sub) {
        return true;
    }
}

module.exports = jwtCheck;
