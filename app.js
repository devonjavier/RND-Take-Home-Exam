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
const e = require('express');
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

server.post('/update', (req, resp) => {

    const update_ques = {
        question: req.body.question,
        choices: req.body.choices,
        correct_index: parseInt(req.body.correct_choice, 10)
    };


    if (!update_ques.question || !update_ques.choices || update_ques.choices.length < 2 || update_ques.correct_index === undefined) {
        console.log('error, cancelling');
        resp.status(400).send('Invalid input');
        return; 
    }

    questionModel.findOneAndUpdate({_id : req.body.question_id}, update_ques, {new : true}).lean()
    .then((updated) => {
        if(!updated){
            console.log('ques not found');
        } else {
            resp.redirect('/');
        }
    })
    
})

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

server.get('/get', (req, resp) => {
    const questionId = req.query.id;
    const action = req.query.action;

    questionModel.findById(questionId).lean().then((questiondata) => {
        questiondata.choices = questiondata.choices.map((current_choice, index) => {
            return {
                choice : current_choice,
                isCorrect : index === questiondata.correct_index
            }
        });

        if(action === 'edit'){
            resp.render('edit', {
                layout: 'index',
                title: 'Edit Question',
                question : questiondata
            });
        } else if (action === 'answer') {
            resp.render('answer', {
                layout: 'index',
                title: 'Answer Question',
                question : questiondata
            });
        } else {
            console.log('error');
            return;
        }
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