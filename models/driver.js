

const mongoose = require('mongoose');
const { Schema } = mongoose;
const driverSchema = new Schema({
    id: Schema.Types.UUID,
    full_name: String,
    phone_number: {type:String, unique: true,index: true},
    password: String,
    token:String,
  });

const DriverDb = mongoose.model('Driver', driverSchema);

module.exports = DriverDb;