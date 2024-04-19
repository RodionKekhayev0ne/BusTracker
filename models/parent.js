const mongoose = require('mongoose');
const { Schema } = mongoose;
const parentSchema = new Schema({
    id: Schema.Types.UUID,
    full_name: String,
    phone_number: String,
    password: String,
    child: { type: Schema.Types.ObjectId, ref: 'Child' },
    token:String,
  });

  const parentDb = mongoose.model('Parent', parentSchema);

module.exports = parentDb;