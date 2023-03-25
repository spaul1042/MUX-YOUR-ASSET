import { useState } from "react";
import styles from "@/styles/Myloans.module.css";
import NavBar from "../components/NavBar";
import { Xumm } from "xumm";

// Signin Form basically means registering ones account

const Myloans = () => {
  const [loading, setloading] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [filteredLoans, setFilteredLoans] = useState([]);

  const payback = async (_id, interest_rate, funders, currency_code) => {
    // setloading(true);
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15");

    const issuer_account = "r9ipnvUgT4ZYVbiNib4sLCzJ3RGzxfXp6y";
    // this is the account which has issued the MUX and XUM token
    console.log("before payload");

    alert(
      "Now you will have to pay the total loan amount to all those funders whi have funded your loan, you will get a series of sign requests (xumm qr code link on alerts) to pay back loans"
    );

    let temp = 0;
    for (let i = 0; i < funders.length; i++) {
      let amount = funders[i].funding_amount;
      let int = amount * (interest_rate / 100);
      const final_amount = amount + int;

      const address = funders[i].funder_address;

      let send_token_tx = {};
      if (currency_code === "XRP") {
        send_token_tx = {
          TransactionType: "Payment",
          Account: accountAddress,
          Amount: (final_amount * 1000000).toString(),
          Destination: address,
        };
      } else {
        send_token_tx = {
          TransactionType: "Payment",
          Account: accountAddress,
          Amount: {
            currency: currency_code,
            value: final_amount,
            issuer: issuer_account,
          },
          Destination: address,
        };
      }

      // Payload
      xumm.payload
        .createAndSubscribe(send_token_tx, (eventMessage) => {
          if (Object.keys(eventMessage.data).indexOf("opened") > -1) {
            // Update the UI? The payload was opened.
          }
          if (Object.keys(eventMessage.data).indexOf("signed") > -1) {
            // The `signed` property is present, true (signed) / false (rejected)

            return eventMessage;
          }
        })
        .then(({ created, resolved }) => {
          alert(created.refs.qr_png);
          console.log("Payload URL:", created.next.always);
          console.log("Payload QR:", created.refs.qr_png);

          return resolved; // Return payload promise for the next `then`
        })
        .then(async (payload) => {
          // Updating the database when the payload has been signed
          console.log("Updating database");
          alert("Successfull loan repayment to the last funder");
          temp++;
        });
    }

    const formData2 = {
      account_address: accountAddress,
      _id: _id,
    };
    console.log("True5");
    const response = await fetch("http://localhost:8000/api/payback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData2),
    });
    alert("Loan repaid successfully");

    // setloading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setloading(true);
    // returns an array of loan objects
    const response = await fetch(
      "http://localhost:8000/api/myloans?" +
        new URLSearchParams({
          account_address: accountAddress,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (response.status === 201) {
      console.log(201);
      setFilteredLoans(data.myloans);
      // setDemo();
    } else if (response.status === 401) {
      setFilteredLoans([]);
      alert(data.message);
      return;
    } else {
      return;
    }

    setloading(false);
  };

  if (loading) {
    return (
      <>
        <div>Loading Content Please wait!</div>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.h2}> Get Your Requested Loans</h2>

        <div className={styles.field}>
          <label htmlFor="accountAddress" className={styles.label}>
            Account Address
          </label>
          <input
            id="accountAddress"
            type="text"
            value={accountAddress}
            onChange={(event) => setAccountAddress(event.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Get My Loan Requests
        </button>
      </form>

      <div className={styles.loan_cards_container}>
        {filteredLoans.map((loan, index) => (
          <div key={index} className={styles.loan_card}>
            <p>Loan ID: {loan._id}</p>
            <p>Current unfunded Loan Amount: {loan.loan_amount}</p>
            {/* Borrower can pay back only when the loan is completely funded and its not paid yet */}
            {loan.loan_amount <= 0 && loan.paid_or_not === 0 ? (
              <button
                onClick={() => {
                  payback(
                    loan._id,
                    loan.interest_rate,
                    loan.funders,
                    loan.currency_code
                  );
                }}
                className={styles.pay_button}
              >
                Pay Back
              </button>
            ) : (
              <button className={styles.disabled_button} disabled>
                { loan.paid_or_not === 1 ? "Paid" : "Pay Back"}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Myloans;
