const express = require('express');
const path = require('path');
const UserRouter = require('./routes/UserRouter');

const app = express();


app.use(express.json());


app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use('/api/user', express.static('views'));


app.use('/api/user', UserRouter);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (_req, res) => {
    return res.status(404).json({ message: 'Page Not Found' });
});


module.exports = app;