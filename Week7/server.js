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
const path = require("path");

//set up db connection
const mongoose = require('mongoose');
const { title } = require("process");
// create schemas

const pageSchema = new mongoose.Schema({
    slug: String,//about-us friendly url
    name: String,//About Us
    description: String,
});

const gallerySchema = new mongoose.Schema({
    name: String,
    description: String,
});

const imageSchema = new mongoose.Schema({
    url: String,
    caption: String,
    gallery: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'galleries' }
});

const destinationSchema = new mongoose.Schema({
    page: String,
    name: String,
    description: String,
    image: String
},{
    virtuals: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true },
});
// See virtuals in mongoose documentation: https://mongoosejs.com/docs/guide.html#virtuals
destinationSchema.virtual("activities", {
    ref: "activities",
    localField: "_id",
    foreignField: "destination"
});

gallerySchema.virtual("images", {
    ref: "images",
    localField: "_id",
    foreignField: "gallery"
});

// Activities schema for things to do in each destination
const activitySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    cost: Number,
    destination: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'destinations' }
});

const Destination = mongoose.model("destinations", destinationSchema);

const Activity = mongoose.model("activities", activitySchema);

const Page = mongoose.model("pages", pageSchema);

const Gallery = mongoose.model("galleries", gallerySchema);

const Image = mongoose.model("images", imageSchema);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelsite');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));

//Serving static files
//review middleware in express under week 7 in blackboard or: https://expressjs.com/en/guide/using-middleware.html
app.use(express.static(path.join(__dirname, "static")));
//parse the body of the incomming reuqests
app.use(express.urlencoded({ extended: true }));
//data
// Set up Basic CORS headers for communicating with APIs
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.get("/", async (req, res) => {
//Homepage Route
const homePage = await Page.findOne({ slug: "home" }).lean();

const gallery = await Gallery.findOne({ name: "home" }).populate("images").lean();

const destinations = await Destination.find().lean();
res.render("home", { 
    title : homePage.name,
    description: homePage.description,
    galleryImages: gallery.images,
    destinations: destinations
});
});

//generate routes to populate destinatios page
app.post("/destinations", async (req, res) => {
  // code to add a new destination to the database
  const { page, name, description, image } = req.body;
  console.log(req.body);
  const newDestination = new Destination({
    page,
    name,
    description,
    image,
  });
  await newDestination.save();
  //res.redirect("/destinations");
  res.send("Destination added successfully");
});

app.get("/destinations", async (req, res) => {
  const destinations = await Destination.find().lean();
  res.render("destinations", {
    destinations: destinations,
    title: "Destinations",
  });
});

//Get a specific destination by _id
app.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id)
    .populate("activities")
    .lean();
  //const activities = await Activity.find({ destination: id }).lean();

  res.render("details", {
    destination: destination,
    title: destination.name,
    activities: destination.activities,
  });
});

//activities routes
app.post("/activities", async (req, res) => {
  const { name, description, image, cost, destination } = req.body;
  const newActivity = new Activity({
    name,
    description,
    image,
    cost,
    destination,
  });
  await newActivity.save();
  res.send("Activity added successfully");
});

//Create a new page
app.post("/pages", async (req, res) => {
  const { slug, name, description } = req.body;
  const newPage = new Page({
    slug,
    name,
    description,
  });
  await newPage.save();
  res.send("Page added successfully");
});

//Create a new gallery
app.post("/galleries", async (req, res) => {
  const { name, description } = req.body;
  const newGallery = new Gallery({
    name,
    description,
  });
  await newGallery.save();
  res.send("Gallery added successfully");
});

//Create a new image
app.post("/images", async (req, res) => {
  const { url, caption, gallery } = req.body;
  const newImage = new Image({
    url,
    caption,
    gallery,
  });
  await newImage.save();
  res.send("Image added successfully");
});
//setup basic api routes
app.get("/api/destinations", async (req, res) => {
  const destinations = await Destination.find().lean();
  res.json(destinations);
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
