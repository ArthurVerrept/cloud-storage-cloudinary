const multer = require("multer");
const express = require('express');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
var handlebars = require('express-handlebars');
const config = require('./config/config')
const mongoose = require('mongoose');

const db = require('./config/keys').MongoURI;

// connect to mongo
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
.then(()=> console.log('mongodb connected'))
.catch(err=>console.log(err))

const Outfit = require('./models/Outfit.js');

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
});
  const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "clothing-users-app",
  allowedFormats: ["jpg", "png"]
});
const parser = multer({ storage: storage });

const app = express();

app.use(express.static('public'));


// HandleBars
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));


app.get('/', (req, res) => {
  res.render('index', {layout: 'main'})
});

app.post('/upload', parser.any(), (req, res) => {
  console.log(req);
    const fit = { Hats } = req.body;
    const newOutfit = new Outfit({
    userID: 'testID',
    Accessories: 'sendFit.Accessories',
    Hats: fit.Hats,
    Outerwear: 'sendFit.Outerwear',
    Tops: 'sendFit.Tops',
    Bottoms: 'sendFit.Bottoms',
    FullBody: 'sendFit.FullBody',
    Shoes: 'sendFit.Shoes',
    ImageURL: req.files[0].url
  });
  console.log(newOutfit)
  newOutfit.save();
  res.redirect('/')
});

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`app listening on port ${PORT}`));