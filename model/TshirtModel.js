const mongoose = require('mongoose');

const tshirtSchema = new mongoose.Schema({
  id: String,
  Product: String,
  Album: [String],
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
  StyleTips3: String,  // This exists in your data
  WashCare: String,
  WashCare2: String,
  WashCare3: String,
  category: String
});

module.exports = mongoose.model('Tshirts', tshirtSchema);
