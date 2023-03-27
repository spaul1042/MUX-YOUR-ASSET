import { useState, useEffect } from "react";
import styles from "@/styles/SignInForm.module.css";
import NavBar from "../components/NavBar";
import { Xumm } from "xumm";

// Signin Form basically means registering ones account

const SignInForm = () => {
  const [accountAddress, setAccountAddress] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if(accountAddress.length != 34 || accountAddress[0] != 'r')
    {
      alert("Account Address Not valid, remove spaces/enter a valid account address of length 34");
      return;
    }
    const response = await fetch("http://localhost:8000/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_address: accountAddress,
        name: name,
        password: password,
        collateral: [],
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

  useEffect(() => {
    // setloading(true);

    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true,
      redirectUrl: document.location.href + "?custom_state=test", // Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });

    xumm.on("error", (error) => {
      console.log("error", error);
    });

    xumm.on("success", async () => {
      xumm.user.account.then((account) => {
        setAccountAddress(account);
        setConnected(true);
      });
    });

    // xumm.on("retrieved", async () => {
    //   xumm.user.account.then((account) => {
    //     console.log("inside signin");
    //     setAccountAddress(account);
    //     setConnected(true);
    //   });
    // });

    // setloading(false);
  }, [accountAddress]);

  return (
    <>
      <NavBar />

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.h2}> Register your account </h2>
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
