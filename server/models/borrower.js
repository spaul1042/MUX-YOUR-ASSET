const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
    account_address: {
        required: true,
        type: String
    },
    requested_loans:{
        required:true,
        type:[String]  // array of all MongoDb loan ids of the Loan Model requested by the borrower
    }
})

module.exports = mongoose.model('Borrower', borrowerSchema, "borrower")