import styles from "@/styles/Borrow.module.css";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";

// {account_address, currency_code, loan_amount, loan_duration, interest_rate, funders(emptyarray), collateral_currency_code }

export default function Borrow() {
  const [loading, setloading] = useState(true);
  const [formData, setFormData] = useState({
    account_address: "",
    currency_code: "",
    loan_amount: 0,
    loan_duration: 3,
    interest_rate: 12,
    funders: [],
    collateral_currency_code: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      formData.account_address.length != 34 ||
      formData.account_address[0] != "r"
    ) {
      alert(
        "Account Address Not valid, remove spaces/enter a valid account address of length 34"
      );
      return;
    }

    // Check whether the borrower has the minimum reuired collateral amountor not for that collateral , if yes then proceed

    const response = await fetch("http://localhost:8000/api/borrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (response.status == 400) {
      alert(data.message);
      // handle successful sign-in
    } else {
      alert("Loan succesfully registered");
      // handle failed sign-in
    }
  };

  useEffect(() => {
    setloading(false);
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
      <div>
        <div className={styles.borrow_form}>
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
          <select
            type="text"
            className={styles.borrow_form__input2}
            placeholder="Enter Loan Currency Code"
            name="currency_code"
            value={formData.currency_code}
            onChange={handleChange}
          >
            <option value="XRP">XRP</option>
            <option value="MUX">MUX</option>
            <option value="XUM">XUM</option>
          </select>
          <div className={styles.prefix}> Loan Amount:</div>{" "}
          <input
            type="number"
            step="1"
            className={styles.borrow_form__input}
            placeholder="Enter amount to borrow"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
          />
          <div className={styles.prefix}> Loan Duration in months: </div>
          <input
            type="number"
            step="1"
            className={styles.borrow_form__input}
            placeholder="Enter Loan Duration"
            name="loan_duration"
            value={formData.loan_duration}
            onChange={handleChange}
          />
          <div className={styles.prefix}> Rate of Interest:</div>{" "}
          <input
            type="number"
            step="0.1"
            className={styles.borrow_form__input}
            placeholder="Enter Rate of interest"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
          />
          <div className={styles.prefix2}> Currency Code of Collateral:</div>{" "}
          <select
            type="text"
            className={styles.borrow_form__input2}
            placeholder="Enter Currency code of Collateral Staked"
            name="collateral_currency_code"
            value={formData.collateral_currency_code}
            onChange={handleChange}
          >
            <option value="XRP">XRP</option>
            <option value="MUX">MUX</option>
            <option value="XUM">XUM</option>
          </select>
          <button className={styles.borrow_form__button} onClick={handleSubmit}>
            Place a Loan Request
          </button>
        </div>
      </div>
    </>
  );
}
