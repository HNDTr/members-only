const {Router} = require('express');
const {getSignUpPage, userCreate, getLoginPage, getMembershipPage, membershipChange}  = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/sign-up', getSignUpPage);
userRouter.post('/sign-up', userCreate);
userRouter.get('/log-in', getLoginPage);
userRouter.get('/member', getMembershipPage);
userRouter.post('/member', membershipChange)

module.exports = userRouter