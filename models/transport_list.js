const mongoose = require('mongoose');
const {Schema} = mongoose;
const transport_listSchema = new Schema({
    id: Schema.Types.UUID,
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    children: [{ type: Schema.Types.ObjectId, ref: 'Child' }],
    location: { type: Schema.Types.ObjectId, ref: 'Location'},
    is_transporting: Boolean,
});
const Transport_listDb = mongoose.model('Transport_list', transport_listSchema);

module.exports = Transport_listDb;
