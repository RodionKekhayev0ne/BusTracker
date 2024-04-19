const mongoose = require('mongoose');
const {Schema} = mongoose;
const locationSchema = new Schema({
    id: Schema.Types.UUID,
    latitude: Number,
    longitude: Number,
});

const locationDB = mongoose.model('Location', locationSchema);

module.exports = locationDB;