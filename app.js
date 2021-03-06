const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const _ = require('lodash');

const app = express();
const port = 3000;

//Enable EJS
app.set("view engine", "ejs");
//Enable bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to mongodb w/ mongoose
mongoose.connect("mongodb://localhost:27017/mytodo", {useNewUrlParser: true});
////////////////////////////////////////////////////////////////////////////////

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const item4 = new Item({
  name: "Double click the right + button in the header to make a new list"
});

const item5 = new Item({
  name: "Double click the left ... ellipsis to view your custom lists."
});

const defaultItems = [item1, item2, item3, item4, item5];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Default items have been applied a list!");
        }
      });
      res.redirect("/");
    } else {
      List.find({}, function(err, lists){

        if (!err){
          res.render("list", {lists: lists, listTitle: "Today", newListItems: foundItems});
        }
      });

    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show existing list
        List.find({}, function(err, lists){

          if (!err){
          res.render("customList", {
            lists: lists,
            listTitle: foundList.name,
            newListItems: foundList.items
          });
          }
        });
      }
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/customList", function(req, res){
  const newCustomList = _.capitalize(req.body.customList);

  if (!newCustomList){
    res.redirect("/")
  } else {
    res.redirect("/" + newCustomList);
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Item deleted from list!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

////////////////////////////////////////////////////////////////////////////////
//Start server
app.listen(port, function(){
  console.log("Server running on port:" + port);
});
