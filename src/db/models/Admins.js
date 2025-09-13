const { Schema, model } = require('mongoose');

const AdminSchema = new Schema({
  phone: String, // e.g. "94766359869"
  name: String,
  role: String
});

module.exports = model('Admin', AdminSchema);
