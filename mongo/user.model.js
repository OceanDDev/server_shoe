const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ 
  fullname: { type: String, required: true },
  birthday: { type: String,required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
