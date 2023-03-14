const mongoose = require('mongoose');


const fundedLoansSchema = new mongoose.Schema({
    loan_id:{
       required:true,
       type:String
    },
    funding_amount:{
        required:true,
        type:Number
    }
})

const lenderSchema = new mongoose.Schema({
    account_address: {
        required: true,
        type: String
    },
    funded_loans:{
        required:true,
        type:[fundedLoansSchema]  // array of all MongoDb loan ids of the Loan Model requested by the borrower
    }
})

module.exports = mongoose.model('Lender', lenderSchema, "lender")