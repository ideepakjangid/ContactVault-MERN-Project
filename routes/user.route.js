const express = require('express');
const UserController = require('../controllers/user.controller');
const UserRouter = express.Router();
UserRouter.post(
    '/create',UserController.create
)
UserRouter.post(
    '/login',UserController.login
)

module.exports = UserRouter;