const express = require("express");
const router = express.Router();

const Loan = require("../models/loan");
const Borrower = require("../models/borrower");
const Lender = require("../models/lender");
const User = require("../models/user");

// API Endpoint for posting a loan request, which also updates Borrower model
// >> {account_address, currency_code, loan_amount, loan_duration, interest_rate, funders(emptyarray), collateral_currency_code }
// A) Tested >> Working

router.post("/borrow", async (req, res) => {
  try {
    // 1) Updating the Loan Model
    const query1 = User.findOne({
      account_address: req.body.account_address,
    });

    query1
      .then((user) => {
        if (!user) {
          res.status(400).json({ message: "User not found" });
        } else {
          // Update the collateral array of the user
          let user_collateral = user.collateral;
          let amount = 0;

          for (let i = 0; i < user_collateral.length; i++) {
            if (
              user_collateral[i].currency_code ===
              req.body.collateral_currency_code
            ) {
              amount += user_collateral[i].collateral_amount;
              user_collateral[i].collateral_amount =
                user_collateral[i].collateral_amount - req.body.loan_amount;
              break;
            }
          }

          if (amount < req.body.loan_amount) {
            res.status(400).json({ message: "Insufficient Collateral" });
          } else {
            // save the updated user collateral to the database
            User.findOneAndUpdate(
              { account_address: req.body.account_address },
              { $set: { collateral: user_collateral } },
              { new: true }
            ).then(() => {
              const loan = new Loan({
                account_address: req.body.account_address,
                currency_code: req.body.currency_code,
                loan_amount: req.body.loan_amount,
                loan_duration: req.body.loan_duration,
                interest_rate: req.body.interest_rate,
                funders: req.body.funders,
                collateral_currency_code: req.body.collateral_currency_code,
              });
              loan.save().then(() => {
                // 2)  Updating Borrower Model
                const query2 = Borrower.findOne({
                  account_address: req.body.account_address,
                });

                query2
                  .then(async (borrower) => {
                    if (!borrower) {
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
                      let new_requested_loans = borrower.requested_loans;
                      new_requested_loans.push(loan._id);

                      // updating the object
                      await Borrower.updateOne(
                        { account_address: req.body.account_address },
                        { $set: { requested_loans: new_requested_loans } }
                      );
                    }

                    // Send the response after all asynchronous operations have completed
                    res.status(201).json(loan);
                  })
                  .catch((err) => {
                    res.status(400).json({ message: err.message });
                  });
              });
            });
          }
        }
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for posting a lend request which also changes the Loan Model
// >> (account_address, loan_id, funding_amount)
// B) tested >> Working

router.post("/lend", async (req, res) => {
  try {
    // ends at 209
    // 3) Updating the Loan Model
    const query3 = Loan.findOne({
      _id: req.body.loan_id,
    });

    query3 // 119- 208
      .then((loan) => {
        if (!loan) {
          res.status(400).json({ message: "Loan Id is not valid" });
        } else {
          // ends at 207
          let new_loan_amount = loan.loan_amount;
          new_loan_amount -= req.body.funding_amount;

          let new_funders = loan.funders;
          let present = false;
          let index_present = -1;
          for (let i = 0; i < new_funders.length; i++) {
            if (new_funders[i].funder_address === req.body.account_address) {
              present = true;
              index_present = i;
              break;
            }
          }

          if (present) {
            new_funders[index_present].funding_amount +=
              req.body.funding_amount;
          } else {
            new_funders.push({
              funder_address: req.body.account_address,
              funding_amount: req.body.funding_amount,
            });
          }

          // updating the object 147- 206
          Loan.updateOne(
            { _id: req.body.loan_id },
            { $set: { funders: new_funders, loan_amount: new_loan_amount } }
          ).then(async () => {
            // 4) Updating Lender Model
            const query4 = Lender.findOne({
              account_address: req.body.account_address,
            });

            query4 // 157 -205
              .then(async (lender) => {
                if (!lender) {
                  // the lender has placed a lend request for the first time
                  const new_funded_loans = [
                    {
                      loan_id: req.body.loan_id,
                      funding_amount: req.body.funding_amount,
                    },
                  ];

                  // creating the object
                  const new_lender = new Lender({
                    account_address: req.body.account_address,
                    funded_loans: new_funded_loans,
                  });
                  await new_lender.save();
                } else {
                  // the lender has already placed one or more lend requests
                  let new_funded_loans = lender.funded_loans;
                  let present = false;
                  let index_present = -1;
                  for (let i = 0; i < new_funded_loans.length; i++) {
                    if (new_funded_loans[i].loan_id === req.body.loan_id) {
                      present = true;
                      index_present = i;
                      break;
                    }
                  }
                  if (present) {
                    new_funded_loans[index_present].funding_amount +=
                      req.body.funding_amount;
                  } else {
                    new_funded_loans.push({
                      loan_id: req.body.loan_id,
                      funding_amount: req.body.funding_amount,
                    });
                  }

                  // updating the object
                  await Lender.updateOne(
                    { account_address: req.body.account_address },
                    { $set: { funded_loans: new_funded_loans } }
                  );
                }
                res.status(201).json({ message: "success" });
              })
              .catch((err) => {
                res.status(400).json({ message: err.message });
              });
          });
        }
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for signing in and creating an object in the user Model
// >> {account_address, name, password, collateral(empty array)}
// C)  Tested >> Working
// without signin , you cannot deposit collateral

router.post("/signin", async (req, res) => {
  try {
    // 5) Updating the User Model

    const query5 = User.findOne({
      account_address: req.body.account_address,
    });
    query5
      .then((user) => {
        if (!user) {
          // create a new User object
          const new_user = new User({
            account_address: req.body.account_address,
            name: req.body.name,
            password: req.body.password,
            collateral: [],
          });
          new_user.save();
          res.status(201).json({ message: "success" });
        } else {
          res.status(400).json({ message: "User already exists" });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoint for depositing collateral
// >> {account_address, currency_code, collateral_amount}
// D) tested >> working

router.post("/deposit_collateral", async (req, res) => {
  try {
    // 5) Updating the User Model
    // Find the user using findOne query then use call back functions (.then , .catch)

    const query6 = User.findOne({
      account_address: req.body.account_address,
    });
    query6
      .then(async (user) => {
        if (!user) {
          res.status(400).json({ message: "User not found" });
        } else {
          // Update the collateral array of the user
          let new_collateral = user.collateral;
          let present = false;
          let index_present = -1;
          for (let i = 0; i < new_collateral.length; i++) {
            if (new_collateral[i].currency_code === req.body.currency_code) {
              present = true;
              index_present = i;
              break;
            }
          }

          if (present) {
            new_collateral[index_present].collateral_amount +=
              req.body.collateral_amount;
          } else {
            new_collateral.push({
              currency_code: req.body.currency_code,
              collateral_amount: req.body.collateral_amount,
            });
          }

          // updating the object
          await User.updateOne(
            { account_address: req.body.account_address },
            { $set: { collateral: new_collateral } }
          );
          res.status(201).json({ message: "success" });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET Requests API endpoint to get all loans placed on the platform 
router.get("/loans", async (req, res) => {
  const query7 = Loan.find({});

  query7
    .then((loans) => {
      res.status(201).json({ active_loans: loans });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

// API endpoint to check whether an account address is registered or not!
router.get("/check_register", async (req, res) => {

  console.log(req.query.account_address);
  User.find({account_address:req.query.account_address})
    .then((user) => {
      if(user === null)
      {
        console.log(2)
        res.status(400).json({ message: "user not found" });
      }
      else if(user.length === 0)
      {
        console.log(2)
        res.status(400).json({ message: "user not found" });
      }
      else{
        console.log(1)
        res.status(201).json({ message : "user found" })
      }
      
    })
    .catch((err) => {
      console.log(3)
      res.status(400).json({ message: err.message });
    });
});


// API Endpoint to filter loans based on currency code 
router.get("/selected_loans", async (req, res) => {

  console.log(req.query.currency_code);
  Loan.find({currency_code:req.query.currency_code})
    .then((loans) => {
      if(loans.length === 0)
      {
        res.status(401).json({message: "No loan found with the given currency code"});
      }
      else{
      res.status(201).json({ loans: loans });
      }
    })
    .catch((err) => {
      console.log(3)
      res.status(400).json({ message: err.message });
    });
});


// API Endpoint to get all loan requests of an account address
router.get("/myloans", async (req, res) => {

  console.log(req.query.account_address);
  Loan.findOneAndDelete({account_address:req.query.account_address})
    .then((sel_loans) => {
      if(sel_loans === null)
      {
        res.status(401).json({message: "error"});
      }
      else if(sel_loans.length === 0)
      {
        res.status(401).json({message: "You have not placed any loan request"});
      }
      else{
         res.status(201).json({ myloans: sel_loans});
      }
    })
    .catch((err) => {
      console.log(3)
      res.status(401).json({ message: err.message });
    });
});



// API Endpoint to get all loans funded from an account address
router.get("/myfundings", async (req, res) => {

  console.log(req.query.account_address);
  Lender.findOne({account_address:req.query.account_address})
  .then((sel_lender) => {
    console.log(sel_lender);
    if(!sel_lender || !sel_lender.funded_loans || sel_lender.funded_loans.length === 0)
    {
      res.status(401).json({message: "You have not funded any loan request"});
    }
    else{
       res.status(201).json({ myfundings: sel_lender.funded_loans });
    }
  })
  .catch((err) => {
    console.log(3)
    res.status(401).json({ message: err.message });
  });
});

module.exports = router;
