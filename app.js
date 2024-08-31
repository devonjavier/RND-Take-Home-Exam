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

const questionSchema = new mongoose.Schema({
    question : { type: String, required: true },
    choices : { type: [String], required: true },
    correct_index: { type: Number, required: true }
}, {versionKey : false});

const questionModel = mongoose.model('Question', questionSchema);

// routes for exam
server.post('/create', (req, resp) => {
    console.log(req.body);

    const {
        newQuestion: question,
        choices,
        correct_choice
    } = req.body

    if(!question || !choices || choices.length < 2 || correct_choice == undefined ){
        console.log('error, cancelling');
        resp.status(400).send('Invalid input');
        return; 
    }

    const correct_index = parseInt(correct_choice, 10);

    const newQ = new questionModel({question, choices, correct_index});

    newQ.save().then((added) => {
        console.log('success'); 
        return questionModel.findOne({question: question})

    }).then((foundQuestion) => {
        resp.redirect('/');
    }).catch((err) => {
        console.log('error');
    });
        
});

server.delete('/delete', (req, resp) => {
    console.log('enter');
    const question_id  = req.query.id;
    questionModel.findByIdAndDelete(question_id)
        .then(deleted => {
            console.log(deleted);
            if (!deleted) {
                console.log('id not found')
            }
            console.log('deleted');
        });

});

// pages
server.get('/', (req, resp) => {
    resp.render('main',{
        layout: 'index',
        title: 'Backend Development Challenge'
    });
});

server.get('/add', (req, resp) => {
    resp.render('add', {
        layout: 'index',
        title: 'Add a Question'
    });
});

server.get('/list', (req, resp) => {
    let questionlist = new Array();
    questionModel.find().then((questions) =>{

        for(const current_q of questions){
            questionlist.push({
                quiz_question : current_q.question,
                choices : current_q.choices,
                correct_index : current_q.correct_index
            });
        }

        resp.render('list', {
            layout: 'index',
            title: 'Question List',
            questionlist: questionlist  
        })
    }); 
});




server.listen(3000, () => {
    console.log('Listening on host port 3000');
})