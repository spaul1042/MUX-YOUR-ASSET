import { useState } from "react";
import styles from "@/styles/Myloans.module.css";
import NavBar from "../components/NavBar";

// Signin Form basically means registering ones account

const Myloans = () => {
  const [accountAddress, setAccountAddress] = useState("");
  const [filteredLoans, setFilteredLoans] = useState([
    { loan_id: "demo", loan_amount: 0 },
    { loan_id: "demo", loan_amount: 12 },
    { loan_id: "demo", loan_amount: 12 },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
  };

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
            <p >Loan ID: {loan.loan_id}</p>
            <p >Current unfunded Loan Amount: {loan.loan_amount}</p>
            {loan.loan_amount <= 0 ? (
              <button className={styles.pay_button}>Pay Back</button>
            ) : (
              <button className={styles.disabled_button} disabled>
                Pay Back
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Myloans;
