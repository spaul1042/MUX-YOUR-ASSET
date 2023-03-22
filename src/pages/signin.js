import { useState } from 'react';
import styles from "@/styles/SignInForm.module.css";
import NavBar from "../components/NavBar";

// Signin Form basically means registering ones account

const SignInForm = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_address: accountAddress,
        name: name,
        password: password,
        collateral:[]
      }),
    });

    if (response.status === 400) {
      alert("failed to register account");
      // handle successful sign-in
    } else {
      alert("Successfully registerd account");
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
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Register your account!
      </button>
    </form>
    </>
  );
};

export default SignInForm;
