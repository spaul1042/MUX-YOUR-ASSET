import { useState } from 'react';
import styles from "@/styles/Deposit.module.css";
import NavBar from "../components/NavBar";
// {account_address, currency_code, collateral_amount}
const Deposit = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [currency_code, setCode] = useState('');
  const [collateral_amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8000/api/deposit_collateral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_address: accountAddress,
        currency_code:currency_code,
        collateral_amount:collateral_amount
      }),
    });

    if (response.ok) {
      console.log("Success");
      // handle successful sign-in
    } else {
      console.log("failure");
      // handle failed sign-in
    }
  };

  return (
    <>
    <NavBar/>
    <form onSubmit={handleSubmit} className={styles.form}>
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
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Currency Code
        </label>
        <input
          id="name"
          type="text"
          value={currency_code}
          onChange={(event) => setCode(event.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Collateral Amount
        </label>
        <input
          id="name"
          type="number"
          value={collateral_amount}
          onChange={(event) => setAmount(event.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Deposit Collateral
      </button>
    </form>
    </>
  );
};

export default Deposit;
