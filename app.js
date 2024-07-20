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
    refreshDatabase();
    User.findOne({ email })
        .then(async (existingUser) => {
            if (existingUser) {
                // If a user with the same email already exists, return an error
                return res.json({
                    redirect: '/',
                    error: 'you are already registered . please login',
                });
            }
            try {
                //Hash the password
                bcrypt.hash(password, 10, async (err, hashedPassword) => {
                    if (err) {
                        console.error(err);
                        console.log("erro here");
                    } else {
                        const newUser = new User({ username, email, phone, password: hashedPassword });
                        await newUser.save();
                        //res.redirect('/login.ejs');
                        res.json({
                            redirect: '/login.ejs'
                        });
                    }
                })
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error registering user' });
            };
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'can not find your account' });
        });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    refreshDatabase();
    User.findOne({ email })
        .then(result => {
            //If user is not found, redirect to the login page with an error message
            if (!result) {

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

app.use((req, res) => {
    res.status(404).render('404');
});


//Helper Function

async function refreshDatabase() {
    try {
        // Get the 'users' collection from the connected Mongoose database
        const usersCollection = mongoose.connection.db.collection('users');

        // Refresh the database by executing a simple query
        await usersCollection.find({}).limit(1).toArray();
    } catch (err) {
        console.error(err);
    }
}