// ket noi collection category trong mongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
})

module.exports = mongoose.models.category || mongoose.model('category',categorySchema)