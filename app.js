//----------------------------------------------------------------------------//
//-----------------------------Main Setup-------------------------------------//
//----------------------------------------------------------------------------//
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

//connect to mongo database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

app.set("view engine", "ejs");//Activate EJS's html file (list.ejs)

let webPages = [
  "index.html"/*0*/
];

app.use(express.static("public"));//Static Folder
app.use(bodyParser.urlencoded({extended: true}));//Activate bodyParser

//-----------------------------Body/ Main/Scripts-------------------------------------//



const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to-do list"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit the check box to delete an item"
});

const defaultItems = [item1, item2, item3];


const listSchema = {
  name: {
    type: String,
    required: true
  },
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


//Default List
app.get("/", function(req, res){

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems, todaysDate: date.getDate()});
      }
  });

});

///New/Custom List
app.get("/:newList", function(req, res){
  const customListName = _.capitalize(req.params.newList);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){

        console.log("Created "+customListName+" as new list!");
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);

      } else {
        console.log("Redirected to "+customListName+" list");
        //Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items, todaysDate: ""});
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
      res.redirect("/"+listName);
    });
  }

});

app.post ("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
          console.log("*An item was deleted from the to-do list*");
          res.redirect("/");
        }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}},
    function(err, results){
      if (!err){
        res.redirect("/" + listName);
      } else {
        console.log(err);
      }
    });
  }



});




//----------------------------------------------------------------------------//
app.listen(port, function(req, res){
  console.log("Server successfully running on port: "+port);
})
//----------------------------------------------------------------------------//
