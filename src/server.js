const express = require('express');
const path = require('path');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const user = require('./server/routes/user');
const image = require('./server/routes/image');
const cookieParser = require('cookie-parser');
const password = '1234';
const mongoUrl = `mongodb+srv://DorBenLulu:${password}@spotit-bx5gf.mongodb.net/test?retryWrites=true`;
const bodyParser = require('body-parser');

let isConnectedToMongoDb = false;

app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static("../public")) 
app.use(express.static("./server/images")) // for fetching images! because client knows the path to the images ./server/images/BAA380.jpg

let dbo;

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
    if (err) {console.log(`----------------${err}----------`); throw err};
    console.log('Connected successfully to database!');
    isConnectedToMongoDb = true;
    dbo = db.db("SpotItCollection");
    
    app.locals.usersCollection = dbo.collection('users');
    app.locals.imgCollection = dbo.collection('images');
    app.locals.airlines = dbo.collection('airlines');
    app.locals.aircrafts = dbo.collection('aircrafts');
    app.locals.countries = dbo.collection('countries');
    app.locals.cities = dbo.collection('cities');
    app.locals.airports = dbo.collection('airports');
    app.locals.cities = dbo.collection('cities');
    app.locals.specialReport = dbo.collection('specialReports');
});

app.get('/home', (req, res) => {
    const userName = req.cookies.userName;
    if(userName) {
        // Load user from database.
        user.getUserFromDb(userName, app.locals.usersCollection, res); // No need to add "res.send()" as getUsersFromDb does it already.
    } else {
        res.send({notLoggedInMessage:"No user logged in."})
    }
});

app.get('/imageFormData', async (req, res) => {
    let imageFormData = {
    };
    const airlines = req.app.locals.airlines;
    const aircrafts = req.app.locals.aircrafts;
    const countries = req.app.locals.countries;
    const cities = req.app.locals.cities;
    const airports = req.app.locals.airports;
    
    const collectionPromise = (collection) => {
        return new Promise((resolve, reject) => {
            // limit to only 10 records find({}).limit(1000)
            collection.find({}).limit(10).toArray((err, result) => {
                err ? reject(err) : resolve(result);
            })});
    }

    const callCollectionPromise = async () => {
        imageFormData.airlines = await (collectionPromise(airlines));
        imageFormData.aircrafts = await (collectionPromise(aircrafts));
        imageFormData.countries = await (collectionPromise(countries));
        imageFormData.cities = await (collectionPromise(cities));
        imageFormData.airports = await (collectionPromise(airports));
        return imageFormData;
    }

    callCollectionPromise()
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
        res.send(401, {errMsg:`Error occured while fetching data from database.`});
    });
});

app.use('/user', user);
app.use('/image', image);


const port = 3002;
app.listen(port, () => console.log(`started listening to port ${port}!`))
module.exports = MongoClient;

/*
app.get('/signup', function(req,res) {
    const userId = Math.floor(Math.random() * 900000) + 100000; //some random number
    res.cookie('user_id', userId, {expires: new Date(2020, 1, 1)});
    res.send("you are signed up with the user id: " + userId + ". go back <a href='/'>HOME</a>")
})

app.get('/logout', function (req, res) {
    res.clearCookie('user_id');
    res.redirect('/');
    res.end();
});
*/

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/index.html"))
})