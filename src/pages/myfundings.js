import { useState } from 'react';
import styles from "@/styles/Myfundings.module.css";
import NavBar from "../components/NavBar";

// Signin Form basically means registering ones account

const Myfundings = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [filteredLoans, setFilteredLoans] = useState([]);


  const handleSubmit = async (event) => {
    event.preventDefault();

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
      alert(data.message);
      return;
    } else {
      return;
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
      <button type="submit" className={styles.submitButton}>
        Get My Loan Requests
      </button>
    </form>
    </>
  );
};

export default Myfundings;
