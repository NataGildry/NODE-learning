const express = require ('express');
const expressBars = require ('express-handlebars');
const path = require ('path');
const app = express();
const fs = require('fs').promises;
const User = require('./models/User');


app.engine('.hbs', expressBars({
    layoutsDir: 'views/layouts',
    extname: 'hbs',
    defaultLayout: 'main-layout'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());


//main
app.get('/', (req, res) => {
    res.render('./layouts/main-layout', {name:'Nataliia', showed: true});
});


//login
app.get('/login', (req, res) => {
    res.render('login')
});
app.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    const user = User.findUser(email, password);
    if (user) {
        // res.redirect('users')
        next();
    } else {
        res.render('login', {message: 'Wrong data'})
    }
}, (req, res) => {
    const users = User.fetchAll();
    res.render('users', {users})
});

//users
app.get('/users', (req, res) => {
    const users = User.fetchAll();
    res.render('users', {users});
});


//register
app.get('/register', (req, res) => {
    res.render('register')});

app.post('/register', (req, res) => {
    const {email, password} = req.body;
    const user = new User(email, password);
    const answer = user.save();
    if (answer) {
        res.redirect('login')
    } else {
        res.render('register', {message: 'Error in register'})
    }
});
// page 404
app.use((req, res) => res.status(404).render('404'));

//server
app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('server was started on port 3000')
    }
} );
// app.get('/', (req, res) => {
//     res.end('node the best!');
// });
// app.get('/hello', (req, res) => {
//     res.end('Hello node the best!');
// });
// app.get('/hello', (req, res) => {
//     res.write('Hello world!');
//     res.end('Hello node the best!');
// });


