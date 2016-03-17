var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  type: {
    default: 'local',
    type: String,
    required: true
  },
  profileId: String, //social account id
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);