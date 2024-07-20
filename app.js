//Returns a function
const express = require('express');
const path = require('path');
//Requiring the 3rd party package
const morgan = require('morgan')
//Requiring the 3rd party package (Mongoose),we use it to connect to database
const mongoose = require('mongoose');
//Requiring the user model
const User = require('./models/user');
//Importing the bcrypt package for password hashing
const bcrypt = require('bcrypt');

//express app, creating an instance to invoke that express app
const app = express();
const jwt = require('jsonwebtoken');
//connect to MongoDB
const dbURI = "mongodb+srv://manarabdulshafi03:2au2MTRpMK3khj9p@cluster0.fv8bm3z.mongodb.net/RegistrationSystem?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
    .then(console.log("connected successfully"))
    .then((result) => app.listen(3003))
    .catch((err) => console.log(err));
//we will not go to step of listening to request for the page till the connection with database happens
app.set('views', path.join(__dirname, 'views'));

// register view engine
app.set('view engine', 'ejs');

//middleware and static files that we want to make public
app.use(express.static('public'));
app.use(express.json());
//for accepting form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.get('/', (req, res) => {
    res.render('Register.ejs', { error: null });
});
app.get('/login.ejs', (req, res) => {
    res.render('login', { error: null });
});

app.get('/dashBoard', (req, res) => {
    res.render('dashBoard', { error: null });
});

app.post('/Register', async (req, res) => {
    const { username, email, phone, password } = req.body;
    // Check if a user with the same email already exists
    User.findOne({ email })
        .then(async (existingUser) => {
            if (existingUser) {
                // If a user with the same email already exists, return an error
                return res.json({
                    redirect: '/Register.ejs',
                    error: 'you are already registered',
                });
            }
            //Hash the password
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) {
                    console.error(err);
                } else {
                    const newUser = new User({ username, email, phone, password: hashedPassword });
                    await newUser.save();
                    res.redirect('/login.ejs');
                }
            })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: 'Error registering user' });
                });
        });

});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('User not found: ', email, password);
    User.findOne({ email })
        .then(result => {
            //If user is not found, redirect to the login page with an error message
            if (!result) {
                console.log('User not found');
                res.json({
                    redirect: '/login.ejs',
                    error: 'Incorrect email or password'
                });
            } else {
                res.json({
                    username: result.username,
                    email: result.email,
                    phone: result.phone
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.json({ error: 'Error logging in' });
        });

});


// app.post('/dashBoard', (req, res) => {
//     console.log("iam here3");
//     const { username, email, phone } = req.body;
//     console.log("iam here3: ", username, email, phone);
//     res.json({
//         username,
//         email,
//         phone
//     });

//     //res.render('dashBoard', { username, email, phone });//do not modify
// });

app.use((req, res) => {
    res.status(404).render('404');
});