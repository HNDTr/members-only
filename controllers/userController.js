// sanitization 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries')

const validateUser = [
    body(['firstName', 'lastName'])
    .trim()
    .isAlpha().withMessage('First and last name must only contain alphabet letters.')
    ,
    body('email')
    .trim()
    .isEmail().withMessage('Must be valid email address.')
    .normalizeEmail()
    .custom(async (email) => {
        const result = await db.findEmail(email);

        if (result.rows.length > 0) {
            throw new Error('Email is already registered.');
        }

        return true;
    }),

    body('username')
    .trim()
    .isLength({ min: 3, max: 20 }) .withMessage('Username must be between 3 and 20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/) .withMessage('Username can only contain letters, numbers, and underscores.')
    .custom(async (username) => {
        const result = await db.findUsername(username);

        if (result.rows.length > 0) {
            throw new Error('Username is already taken.')
        }
        return true
    }),
    

    body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.'),

    body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password.')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match.');
        }

        return true;
    })
]

// bcrypt password before create into database 


async function getSignUpPage(req, res){
    res.render('forms/signupPage', {errors: []});
}

const userCreate = [
    validateUser,
    (req, res, next) => { 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('forms/signupPage', {
                errors: errors.array(), // u can pass another object that have previous body info so that when render after errors, users don't have to fills everything again, then pass those as values 
            });
        }

        next();
    },
    async (req, res, next) => {
        // put user and hash password in database then redirect
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const { firstName, lastName, username, email } = req.body;
            await db.insertUser({ firstName, lastName, username, email, password: hashedPassword });
            res.redirect('/user/log-in');
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
]

async function getLoginPage(req, res) {
    res.render('forms/loginPage')
}



module.exports = {getSignUpPage, userCreate, getLoginPage}
