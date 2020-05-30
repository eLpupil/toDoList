const server = () => {

    const express = require('express');
    const app = express();
    app.use(express.static('public'))
    
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));

    const mongoose = require('mongoose');
    
    mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {        if (err) {
            console.error(err);
        } else {
            console.log("Connected to database");
        }
    });

    const itemSchema = mongoose.Schema({
        name: String
    });

    const Item = mongoose.model('item', itemSchema);
    
    
    app.set('view engine', 'ejs');

    

    // var items = ['buy food', 'cook food', 'eat food'];
    // var workItems = [];

    app.listen('3000', function () {
        console.log('listening on port 3000');
    });

    app.get('/', (req, res) => {
        res.render('list', { listTitle: "Today", itemList: items });
    });

    app.get('/work', (req, res) => {
        res.render('list', { listTitle: "Work List", itemList: workItems });
    })

    app.post('/', (req, res) => {
        let item = req.body.listItem;
        if (req.body.list === 'Work') {
            workItems.push(item);
            res.redirect('/work');
        } else {
            items.push(item);
            res.redirect('/');
        }
    });
}

server();

