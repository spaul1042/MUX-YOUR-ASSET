import { useState } from "react";
import styles from "@/styles/Myfundings.module.css";
import NavBar from "../components/NavBar";

// Signin Form basically means registering ones account

const Myfundings = () => {
  const [accountAddress, setAccountAddress] = useState("");
  const [filteredLoans, setFilteredLoans] = useState([

  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (accountAddress.length != 34 || accountAddress[0] != "r") {
      alert(
        "Account Address Not valid, remove spaces/enter a valid account address of length 34"
      );
      return;
    }

    const response = await fetch(
      "http://localhost:8000/api/myfundings?" +
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
      setFilteredLoans(data.myfundings);
      // setDemo();
    } else if (response.status === 401) {
      setFilteredLoans([]);
      return;
    } else {
      return;
    }
  };

  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.h2}> Get your Funded Loans </h2>
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
          Get My Funded Loans
        </button>
      </form>


      <div className={styles.loan_cards_container}>
        {filteredLoans.map((loan, index) => (
          <div key={index} className={styles.loan_card}>
            <p >Loan ID: {loan.loan_id}</p>
            <p >Funded Amount: {loan.funding_amount}</p>
            {loan.funding_amount > 0 ? (
              <button className={styles.disabled_button} disabled>Get back</button>
            ) : (
              <button className={styles.disabled_button} disabled>
                Get Back
              </button>
            )}
          </div>
        ))}
      </div>

    </>
  );
};

export default Myfundings;
