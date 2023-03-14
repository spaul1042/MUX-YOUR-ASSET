const mongoose = require('mongoose');

const fundersSchema = new mongoose.Schema({
    funder_address:{
       required:true,
       type:String
    },
    funding_amount:{
        required:true,
        type:Number
    }
})

const loanSchema = new mongoose.Schema({
    
    account_address: {
        required: true,
        type: String
    },
    currency_code:{
        required: true,
        type: String
    },
    loan_amount:{
        required: true,
        type: Number
    },
    loan_duration:{
        required: true,
        type: Number // in months 
    },
    interest_rate:{
        required: true,
        type: Number
    },
    funders:{
        required:false,
        type:[fundersSchema]
    }
})

module.exports = mongoose.model('Loan', loanSchema, "loan")