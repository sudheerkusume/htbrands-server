const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  video: String,
  videoss: String,
  title: String,
  titles: String,
  image: String,
  images: String,
  imagess: String,
  image_winter: String,
  name: String,
  names: String,
  namess: String,
  amount: Number,
  amounts: String,
  amountss: String,
  amount_winter: String,
  discount_winter: String,
  discount: Number,
  discounts: String,
  discountss: String,
  ratinng: Number,
  ratinngs: String,
  ratinngss: String,
  id: String
}, { collection: 'Home' }); // Optional: specify collection name if needed

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
