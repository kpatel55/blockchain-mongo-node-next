const express = require('express');
const router = express.Router();
const userService = require('./user.service');

const authenticate = (req, res, next) => {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Wrong username or password' }))
        .catch(err => next(err));
}

const enroll = (req, res, next) => {
    userService.enrollAdmin()
        .then(() => res.json({}))
        .catch(err => next(err));
}


const register = (req, res, next) => {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

const getCurrent = (req, res, next) => {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getById = (req, res, next) => {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

router.post('/authenticate', authenticate);
router.post('/enroll', enroll);
router.post('/register', register);
router.get('/current', getCurrent);
router.get('/:id', getById);

module.exports = router;
