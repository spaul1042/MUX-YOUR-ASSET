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
    // addition (define it only once at the time of creation of a loan object)
    original_loan_amount:{
        required: true,
        type: Number
    },
    // addition (change it only once when the loan is paid completely)
    paid_or_not:{
        required: true,
        type: Number , // 0 or 1 , 0 means not paid and 1 means paid
        default: 0 
    },
    // addition (by default takes its value at the time of creation , no need to do anything with this)
    time:{
        required: true,
        type: Date,
        default: Date.now
    },
    // addition (change only when loan is not paid within the loan_duration)
    penalty:{
        required:true,
        type:Number,
        defualt:0
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
        required:true,
        type:[fundersSchema]
    },
    collateral_currency_code:{
        required:true,
        type:String
    }
})

module.exports = mongoose.model('Loan', loanSchema, "loan")