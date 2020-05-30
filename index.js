const server = () => {

    const express = require('express');
    const app = express();
    app.use(express.static('public'))

    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));

    const mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Connected to database");
        }
    });


    const itemSchema = mongoose.Schema({
        name: String
    });

    const listSchema = mongoose.Schema({
        name: String,
        items: [itemSchema]
    });

    const Item = mongoose.model('item', itemSchema);

    const List = mongoose.model('list', listSchema);

    const item1 = new Item({
        name: 'Welcome to your to-do-list!'
    });

    const item2 = new Item({
        name: 'Click + to add a new item'
    });

    const item3 = new Item({
        name: '<-- Click checkbox to delete'
    });

    const defaultItems = [item1, item2, item3];


    app.set('view engine', 'ejs');


    app.listen('3000', () => {
        console.log('listening on port 3000');
    });


    app.get('/', (req, res) => {

        Item.find((err, items) => {

            if (items.length === 0) {
                Item.insertMany(defaultItems, err => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Successfully inserted default items");
                    }
                });
                res.redirect('/');
            } else {
                res.render('list', { listTitle: "Today", itemList: items });
            }

        });
    });

    
    app.get('/:listId', (req, res) => {
        let listName = req.params.listId;

        List.findOne({ name: listName }, (err, result) => {
            if (!err) {
                if (!result) {
                    let list = new List({name: listName, items: defaultItems});
                    list.save();
                    console.log("new list added");
                    res.redirect(`/${listName}`);
                } else {
                    res.render('list', {listTitle: listName, itemList: result.items});
                }
            }
        })
    });


    app.post('/', (req, res) => {

        if (req.body.list === "Today") {
            let itemName = req.body.listItem;
            const newItem = Item({name: itemName});
            newItem.save();
            res.redirect('/');
        }

    });


    app.post('/delete', (req, res) => {
        let itemId = req.body.checkbox;
        Item.findOneAndDelete(itemId, err => {
            if(!err) {
                console.log('Successfully removed Item');
            }
        });
        res.redirect('/');
    });
}

server();

