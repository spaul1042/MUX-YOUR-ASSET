import styles from "@/styles/Lend.module.css";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import loan from "../../server/models/loan";
import { Xumm } from "xumm";

// Note that here borrowers refer to loans >> Bcz a lender a going to fund a loan

export default function Lend() {
  const [loading, setloading] = useState(false);

  // const [demo, setDemo] = useState();
  const [borrowers, setBorrowers] = useState([]); // all loans of the database
  const [filteredBorrowers, setFilteredBorrowers] = useState([]); // filtered loans
  const [selectedBorrowers, setSelectedBorrowers] = useState([]); // selected loans by the lender whom he/she wants to lend

  const toggleBorrowerSelection = async (borrower) => {
    console.log("BEFORE TOGGLING", selectedBorrowers.length);
    if (selectedBorrowers.includes(borrower)) {
        setSelectedBorrowers(
        selectedBorrowers.filter((curr_borrower) => curr_borrower != borrower)
      );
    } else {
       setSelectedBorrowers([...selectedBorrowers, borrower]);
    }
    console.log("AFTER TOGGLING", selectedBorrowers.length);
  };
  const [formData, setFormData] = useState({
    account_address: "",
    currency_code: "",
    loan_amount: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = async () => {
    setSelectedBorrowers([]);
    const response = await fetch(
      "http://localhost:8000/api/selected_loans?" +
        new URLSearchParams({
          currency_code: formData.currency_code,
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
      setFilteredBorrowers(data.loans);
      // setDemo();
    } else if (response.status === 401) {
      setFilteredBorrowers([]);
      alert(data.message);
      return;
    } else {
      return;
    }
    console.log(selectedBorrowers);
  };

  const handleSubmit = async (event) => {
    if (selectedBorrowers.length === 0) {
      alert("Please select at least one loan");
      return;
    }

    event.preventDefault();
    setloading(true);
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15");

    const issuer_account = "r9ipnvUgT4ZYVbiNib4sLCzJ3RGzxfXp6y";
    // this is the account which has issued the MUX and XUM token
    console.log("before payload");

    // Apply your funding algorithm here and the cross currency payment for each transaction on XRP Ledger
    let loans = new Map(); // mapping of loan id with the current funded amount

    // for (let i = 0; i < selectedBorrowers.length; i++) {
    //   loans.set(selectedBorrowers[i]._id, 0);
    // }

    // funding algorithm : 1 1 1 1 1 1
    //  1 1 1 0 0 1
    //  1 1 0 0 0 0
    // distribute 1's until laon amount of a particuylar loan id becomes 0, Total time complexity O(Lending amount)
    let total_amount = 0;

    for (let i = 0; i < selectedBorrowers.length; i++) {
      total_amount += selectedBorrowers[i].loan_amount;
      console.log(selectedBorrowers[i].loan_amount);
    }
    let amount = formData.loan_amount;

    let temp_selectedBorrowers = selectedBorrowers.map((a) => ({ ...a }));

    // calculating funding districution by risk optimization funding algorithm

    if (amount > total_amount) {
      amount = total_amount;
    }
    let temp = "Total amount to be districuted is: " + amount.toString();

    // alert1
    alert(temp);

    while (amount > 0) {
      for (let i = 0; i < temp_selectedBorrowers.length; i++) {
        if (temp_selectedBorrowers[i].loan_amount > 0) {
          temp_selectedBorrowers[i].loan_amount--;
          amount--;
        }
      }
    }
    for (let i = 0; i < temp_selectedBorrowers.length; i++) {
      console.log(
        temp_selectedBorrowers[i].loan_amount,
        selectedBorrowers[i].loan_amount
      );
    }

    // setting funding amount corresp. to each loan id

    for (let i = 0; i < selectedBorrowers.length; i++) {
      loans.set(
        selectedBorrowers[i]._id,
        selectedBorrowers[i].loan_amount - temp_selectedBorrowers[i].loan_amount
      );
    }

    // alert2
    alert(
      "We have distributed the amount optimally, If there is no error, you will get a series of sign requests (xumm qr code link on alerts) to distribute"
    );

    for (let i = 0; i < selectedBorrowers.length; i++) {
      const amount = loans.get(selectedBorrowers[i]._id);
      if (amount > 0) {
        let send_token_tx = {
          TransactionType: "Payment",
          Account: formData.account_address,
          Amount: {
            currency: formData.currency_code,
            value: amount,
            issuer: issuer_account,
          },
          Destination: selectedBorrowers[i].account_address,
        };

        if (selectedBorrowers[i].currency_code === "XRP") {
          send_token_tx = {
            TransactionType: "Payment",
            Account: formData.account_address,
            Amount: (amount * 1000000).toString(),
            Destination: selectedBorrowers[i].account_address,
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
            }
            return eventMessage;
          })
          .then(({ created, resolved }) => {
            alert(created.refs.qr_png);
            console.log("Payload URL:", created.next.always);
            console.log("Payload QR:", created.refs.qr_png);

            return resolved; // Return payload promise for the next `then`
          })
          .then(async (payload) => {
            // Updating the database
            console.log("Updating database");

            const formData2 = {
              account_address: formData.account_address,
              loan_id: selectedBorrowers[i]._id,
              funding_amount: amount,
            };
            console.log("True5");
            const response = await fetch("http://localhost:8000/api/lend", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData2),
            });

            return { ok: true };
          })
          .then((response) => {
            if (response.ok) {
              console.log("Success");
              alert("Successfully paid last loan");
              // handle successful operation
            } else {
              console.log("failure");
              alert("Last Loan payment failed");
              // handle failed operation
            }
          });
      }
    }
    setloading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        // const response = await fetch("http://localhost:8000/api/loans");
        // const data = await response.json();
        // setBorrowers(data.active_loans);
        console.log("Success");
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setloading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div> Loading Content Please wait!</div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div className={styles.borrow_form}>
        <p className={styles.prefix2}> Fund the Loans!</p>
        <div className={styles.prefix}> Account Address: </div>{" "}
        <input
          type="string"
          className={styles.borrow_form__input}
          placeholder="Enter your account address"
          name="account_address"
          value={formData.account_address}
          onChange={handleChange}
        />
        <div className={styles.prefix}> Loan Currency Code:</div>{" "}

        <input
          type="text"
          className={styles.borrow_form__input2}
          placeholder="Enter Loan Currency Code"
          name="currency_code"
          value={formData.currency_code}
          onChange={handleChange}
        />
          {/* <option value="XRP">XRP</option>
          <option value="MUX">MUX</option>
          <option value="XUM">XUM</option>
        </input> */}

        <div className={styles.prefix}> Loan Amount:</div>{" "}
        <input
          type="number"
          step="1"
          className={styles.borrow_form__input}
          placeholder="Enter amount to fund"
          name="loan_amount"
          value={formData.loan_amount}
          onChange={handleChange}
        />
        <div className={styles.btn}>
          <button className={styles.borrow_form__button} onClick={handleSubmit}>
            Fund The Selected Loans
          </button>
          {/* <p className={styles.prefix2}>
          {" "}
          Filter Loans based on what currency code you want to lend{" "}
        </p> */}
          <button className={styles.borrow_form__button} onClick={handleClick}>
            Filter based on Currency Code!
          </button>
        </div>
      </div>

      <div className={styles.borrowersContainer}>
        <h2 className={styles.subTitle}>Borrowers List:</h2>
        {filteredBorrowers.length > 0 ? (
          <ul className={styles.list}>
            {filteredBorrowers.map((borrower, index) => (
              <li key={index} className={styles.listItem}>
                <div className={styles.borrower}>
                  <span className={styles.name}>
                    {borrower.account_address}
                  </span>
                  <span className={styles.amount}>
                    {borrower.loan_amount} {borrower.currency_code} Tokens
                  </span>
                  <span className={styles.amount}>
                    {borrower.interest_rate} % for {borrower.loan_duration}{" "}
                    months
                  </span>
                  <span className={styles.amount}>
                    Collateral Staked in {borrower.collateral_currency_code}
                  </span>
                  <button
                    className={`${styles.toggleButton} ${
                      selectedBorrowers.includes(borrower)
                        ? styles.selectedToggleButton
                        : ""
                    }`}
                    onClick={() => toggleBorrowerSelection(borrower)}
                  >
                    {selectedBorrowers.includes(borrower) ? "Remove" : "Add"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p> Filter Loans by Currency Code to see more!!</p>
        )}
      </div>
    </>
  );
}
