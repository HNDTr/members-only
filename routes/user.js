const {Router} = require('express');
const {getSignUpPage, userCreate, getLoginPage}  = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/sign-up', getSignUpPage);
userRouter.post('/sign-up', userCreate);
userRouter.get('/log-in', getLoginPage)

module.exports = userRouter