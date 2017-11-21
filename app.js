const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


// Map global promise - get rid of  warning
mongoose.Promise = global.Promise;

//db config
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURL, {
    useMongoClient:true
})
    .then(function () {
        console.log('MongoDB Connected...')
    })
    .catch(function (err) {
        console.log(err);
    })


// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', function (req, res) {
    const title = 'Welcome';
    res.render('index', {title:title});
});

// About Route
app.get('/about', function (req, res) {
    res.render('about');
})

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.port || 5500;

app.listen(port, function(){
console.info('Server started on port ' + port);
})