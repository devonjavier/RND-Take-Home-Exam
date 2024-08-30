const express = require('express')
const server = express();

const bodyParser = require('body-parser')
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

const mongoose = require('mongoose');
const mongo_uri = 'mongodb://127.0.0.1:27017/quiz-website';
mongoose.connect(mongo_uri);

server.use(express.static('public'));

server.get('/', (req, resp) => {
    resp.render('main',{
        layout: 'index',
        title: 'Backend Development Challenge'
    });
});

const questionSchema = new mongoose.Schema({
    question : { type: String, required: true },
    choices : { type: [String], required: true },
    correct_index: { type: Number, required: true }
}, {versionKey : false});

server.listen(3000, () => {
    console.log('Listening on host port 3000');
})