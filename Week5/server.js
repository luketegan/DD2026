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

//generate routes 
app.get("/", (req, res) => {
    //sendFile is used to send a file as a response
    let filePath = path.join(__dirname,"static","homepage.html");
    res.sendFile(filePath);
});

//rendering templates
app.get("home", (req, res) => {
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

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

