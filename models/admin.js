
const mongoose = require('mongoose');
const { Schema } = mongoose;
const adminSchema = new mongoose.Schema({  
    id: Schema.Types.UUID,
    full_name: String,
    phone_number: String,
    password: String,
    token:String,
});
const AdminDb = mongoose.model('Admin', adminSchema);

module.exports = AdminDb;