const mongoose = require('mongoose');

const necktshirtSchema = new mongoose.Schema({
  id: String,
  Product: String,
  Availbaility: String,
  category: String,
  Product_Type: String,
  Color: String,
  Album: [String],
  Title: String,
  in_Stock: String,
  Offer: String,
  Size: String,
  Features: String,
  Features1: String,
  Features2: String,
  StyleTips: String,
  StyleTips1: String,
  StyleTips2: String,
  StyleTips3: String,
  WashCare: String,
  WashCare2: String,
  WashCare3: String,
});

module.exports = mongoose.model('Necktshirt', necktshirtSchema);
