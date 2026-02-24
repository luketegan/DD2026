// 1. Setup a node app with command: npm init
// 2. Install express with command: npm install express
// 3. Create a file named server.js and add the following code:

const express = require('express');
const app = express();
const PORT = 3000;

//https://www.npmjs.com/package/express-handlebars 
const hbs = require('express-handlebars');

app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");

// the path module is used to work with file and directory paths
const path = require('path');

//Serving static files
app.use(express.static(path.join(__dirname, "static")));

//data
const directory = require("./data/directory.json");
console.log(directory);


//generate routes 
app.get("/", (req, res) => {
    //sendFile is used to send a file as a response
    let filePath = path.join(__dirname,"static","homepage.html");
    res.sendFile(filePath);
});

//rendering templates
app.get("/home", (req, res) => {
    res.render("home", {title: "My Website's homepage"});
});

app.get("/about", (req, res) => {
    //sendFile is used to send a file as a response
    let filePath = path.join(__dirname,"static","about.html");
    res.sendFile(filePath);
});

app.get("/images/sample.jpg", (req, res) => {
    let filePath = path.join(__dirname,"static","images","sample.jpg");
    res.sendFile(filePath);
});

//HttP Methods get post put delete
//GET
app.get("/api/items", (req, res) => {
    res.send("This is a get repsonse from /api/items");
});
//POST
app.post("/api/items", (req, res) => {
    res.send("This is a post repsonse from /api/items");
});
//PUT
app.put("/api/items/:id", (req, res) => {
    res.send(`This is a put repsonse from /api/items/`);
});
//DELETE
app.delete("/api/items/:id", (req, res) => {
    res.send(`This is a delete repsonse from /api/items/`);
});

//Directory route
app.get("/directory", (req, res) => {
    res.render("directory", 
        {people: directory});
});

app.get("/person/add",(req, res) => {
    console.log(req.params);
    console.log(req.query);

directory.push({
    id: parseInt(req.query.id),
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    email: req.query.email,
    address: req.query.address,
    city: req.query.city,
    state: req.query.state,
    zip: req.query.zip
});
console.log(directory);

res.send("add-person");
});

app.get("/directory/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    let person = directory.find(p => p.id === parseInt(id));
    
    res.render("person", {
        person: person, 
        title: person.first_name + " " + person.last_name});
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

