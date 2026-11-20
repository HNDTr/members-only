const express = require('express');
const app = express();
const path = require('node:path');
const userRouter = require('./routes/user')


// template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//asset files
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));


//SETUP
app.use(express.urlencoded({extended: true}))

//routes
app.use('/user', userRouter)

const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) {
        throw err
    }
    console.log(`Members only server started - listening on port ${PORT}`);
})
