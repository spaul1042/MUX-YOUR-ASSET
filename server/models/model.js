const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
    
    account_address: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Borrower', borrowerSchema, "borrower")