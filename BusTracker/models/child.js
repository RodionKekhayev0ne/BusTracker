const mongoose = require('mongoose');
const { Schema } = mongoose;
const childSchema = new Schema({
    id: Schema.Types.UUID,
    password: String,
    full_name: String,
    id_num: {type:String, unique: true,index: true},
    address: String,
    home_point: { type: Schema.Types.ObjectId, ref: 'Location'},
    token:String,
  });

const ChildDb = mongoose.model('Child', childSchema);

module.exports = ChildDb;