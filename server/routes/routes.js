const express = require("express");
const router = express.Router();

const Loan = require("../models/loan");
const Borrower = require("../models/borrower");
const Lender = require("../models/lender");
const User = require("../models/user");

// API Endpoint for posting a loan request, which also updates Borrower model
// >> {account_address, currency_code, loan_amount, loan_duration, interest_rate, funding_amount, funders(emptyarray), }
// A)

router.post("/borrow", async (req, res) => {
  try {
    // 1) Updating the  Loan Model
    const loan = new Loan({
      account_address: req.body.account_address,
      currency_code: req.body.currency_code,
      loan_amount: req.body.loan_amount,
      loan_duration: req.body.loan_duration,
      interest_rate: req.body.interest_rate,
      funders: req.body.funders,
    });
    await loan.save();

    // 2)  Updating Borrower Model
    const query2 = Borrower.findOne({
      account_address: req.body.account_address,
    });

    query2.exec(async function (err, borrower) {
      if (err) {
        // handle error
        res.status(400).json({ message: err.message });
      } else if (!borrower) {
        // the borrower has placed a loan request for the first time
        const new_requested_loans = [loan._id];

        // creating the object
        const new_borrower = Borrower({
          account_address: req.body.account_address,
          requested_loans: new_requested_loans,
        });
        await new_borrower.save();
      } else {
        // the borrower has already placed one or more loan requests
        const new_requested_loans = borrower.requested_loans;
        new_requested_loans.push(loan._id);

        // updating the object
        await Borrower.updateOne(
          { account_address: req.body.account_address },
          { $set: { requested_loans: new_requested_loans } }
        );
      }
    });
    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for posting a lend request which also changes the Loan Model
// >> (account_address, loan_id, funding_amount)
// B)

router.post("/lend", async (req, res) => {
  try {
    // 3) Updating Lender Model
    const query3 = Lender.findOne({
      account_address: req.body.account_address,
    });

    query3.exec(async function (err, lender) {
      if (err) {
        // handle error
        res.status(400).json({ message: err.message });
      } else if (!lender) {
        // the lender has placed a lend request for the first time
        const new_funded_loans = [
          {
            loan_id: req.body.loan_id,
            funding_amount: req.body.funding_amount,
          },
        ];

        // creating the object
        const new_lender = Lender({
          account_address: req.body.account_address,
          funded_loans: new_funded_loans,
        });
        await new_lender.save();
      } else {
        // the lender has already placed one or more lend requests
        const new_funded_loans = lender.funded_loans;
        new_funded_loans.push({
          loan_id: req.body.loan_id,
          funding_amount: req.body.funding_amount,
        });

        // updating the object
        await Lender.updateOne(
          { account_address: req.body.account_address },
          { $set: { funded_loans: new_funded_loans } }
        );
      }
    });

    // 4) Updating the Loan Model
    const query4 = Loan.findOne({
      loan_id: req.body.loan_id,
    });

    query4.exec(async function (err, loan) {
      if (err) {
        res.status(400).json({ message: err.message });
      } else if (!loan) {
        res.status(400).json({ message: "Loan Id is not valid" });
      } else {
        const new_funders = loan.funders;
        new_funders.push({
          funder_address: req.body.account_address,
          funding_amount: req.body.funding_amount,
        });

        // updating the object
        await Loan.updateOne(
          { loan_id: req.body.laon_id },
          { $set: { funders: new_funders } }
        );
      }
    });

    res.status(201).json({ message: "succes" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for signing in and creating an object in the user Model
// >> {account_address, name, password, collateral(empty array)}
// C)

router.post("/signin", async (req, res) => {
  try {
    // 5) Updating the User Model

    User.findOne(
      {
        account_address: req.body.account_address,
      },
      async function (err, user) {
        if (err) {
          console.log(err);
          res.status(400).json({ message: err.message });
        } else if (!user) {
          // create a new User object
          const user = new User({
            account_address: req.body.account_address,
            name: req.body.name,
            password: req.body.password,
            collateral: [],
          });
          await user.save();
          res.status(201).json({ message: "success" });
        } else {
          res.status(400).json({ message: "User already exists" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for depositing collateral
// >> {account_address, currency_code, collateral_amount}
// D)

router.post("/deposit_collateral", async (req, res) => {
  try {
    // 5) Updating the User Model

    User.findOne(
      {
        account_address: req.body.account_address,
      },
      async function (err, user) {
        if (err) {
          console.log(err);
          res.status(400).json({ message: err.message });
        } else if (!user) {
          res.status(400).json({ message: "User not found" });
        } else {
          // Update the collateral array of the user
          const new_collateral = user.collateral;
          new_collateral.push({
            currency_code: req.body.currency_code,
            collateral_amount: req.body.collateral_amount,
          });

          // updating the object
          await User.updateOne(
            { account_address: req.body.account_address },
            { $set: { collateral: new_collateral } }
          );
          res.status(201).json({ message: "success" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// GET Requests 


module.exports = router;
