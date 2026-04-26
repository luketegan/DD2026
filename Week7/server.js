// 1. Setup a node app with command: npm init
// 2. Install express with command: npm install express
// 3. Create a file named server.js and add the following code:

const express = require('express');
const app = express();
const PORT = 3001;

//https://www.npmjs.com/package/express-handlebars 
const hbs = require('express-handlebars');

app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");

// the path module is used to work with file and directory paths
const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

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
}
main().catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, "static")));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    destinations: destinations,
});
});

//generate routes to populate destinatios page
app.post("/api/destinations", upload.single("image"), async (req, res) => {

  const { page, name, description } = req.body;
  const image = req.file; 
  console.log(req.body);
  const newDestination = new Destination({
    page,
    name,
    description,
    image: image ? `/images/${image.filename}` : "/images/default.jpg", 
  });
  await newDestination.save();

  res.send("Destination added successfully");
});

app.get("/destinations", async (req, res) => {
  const destinations = await Destination.find().lean();
  res.render("destinations", {
    destinations: destinations,
    title: "Destinations",
  });
});

//Get a specific destination by id
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

app.put("/api/destinations/:id", upload.single("image"), async (req, res) => {
  console.clear();
  const { id } = req.params;
  const { page, name, description } = req.body;
  const image = req.file;

  await Destination.findByIdAndUpdate(id, {
    page,
    name,
    description,
    image: image ? `/images/${image.filename}` : this.image,
  });
  res.send("Destination updated successfully");
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

app.delete("/api/destinations/:id", async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  res.send("Destination deleted successfully");
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

//Get a specific destination by _id
app.get("/api/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id)
    .populate("activities")
    .lean();
  //const activities = await Activity.find({ destination: id }).lean();
  res.json(destination);
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
