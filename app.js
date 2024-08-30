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

server.use(express.static('public'));

server.get('/', (req, resp) => {
    resp.render('main',{
        layout: 'index',
        title: 'Backend Development Challenge'
    });
});

server.listen(3000, () => {
    console.log('Listening on host port 3000');
})