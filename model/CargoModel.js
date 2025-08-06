const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema({
  id: String,
  Availbaility: String,
  category: String,
  Product_Type: String,
  Color: String,
  Album: [String], // Array of image URLs
  Title: String,
  in_Stock: String,
  Tariff: String,
  Offer: String,
  Size: String,
  Features: String,
  Features1: String,
  Features2: String,
  StyleTips: String,
  StyleTips1: String,
  StyleTips2: String,
  WashCare: String,
  WashCare2: String,
  WashCare3: String
});

module.exports = mongoose.model('Cargo', cargoSchema);
