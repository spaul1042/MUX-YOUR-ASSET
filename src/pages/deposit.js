import { useState } from "react";
import styles from "@/styles/Deposit.module.css";
import NavBar from "../components/NavBar";
import { Xumm } from "xumm";
// {account_address, currency_code, collateral_amount}
const Deposit = () => {

  //  currency code : XRP, MUX, XUM
  // Issuer of MUX and XUM is same

  const [accountAddress, setAccountAddress] = useState("");
  const [currency_code, setCode] = useState("");
  const [collateral_amount, setAmount] = useState("");

  
  const payload = async function () {
    const sdk = new Xumm(
      "9f7539a1-f077-4098-8fee-dfc371769a15",
      "5bb59cad-d471-4d0f-8c06-b0463a78eeff"
    );
    const appinfo = await sdk.ping();
    console.log(appinfo.application.name);
    
    const intermediary_account = "ra26ykT87BwwEriSdyoMbDcKPdaNpRnaoS" ;  // Name on Account on Xumm Wallet -> Test
    // this is the intermediary account on MUX-YOUR-ASSET software, where all the collateral is deposited and defaulting repayments happens
    const issuer_account = "r9ipnvUgT4ZYVbiNib4sLCzJ3RGzxfXp6y";
    // this is the account which has issued the MUX and XUM token

    const send_token_tx = {
      "TransactionType": "Payment",
      "Account": accountAddress,
      "Amount": {
        "currency": currency_code,
        "value": collateral_amount,
        "issuer": issuer_account
      },
      "Destination": intermediary_account
    }

    console.log("before paylaod");
    const payload = await sdk.payload.create(send_token_tx, true);
    console.log("after paylaod");

    // console.log(payload)
    alert("Click Ok to get the qr code for signing transactions");
    alert(payload.refs.qr_png);
    console.log(payload.refs.qr_png);

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await payload();
    
    const response = await fetch(
      "http://localhost:8000/api/deposit_collateral",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_address: accountAddress,
          currency_code: currency_code,
          collateral_amount: collateral_amount,
        }),
      }
    );

    if (response.ok) {
      console.log("Success");
      alert("Successfully deposited Collateral");
      // handle successful operation
    } else {
      console.log("failure");
      alert("Collateral not deposited because of an error");
      // handle failed operation
    }
  };

  return (
    <>
      <NavBar />
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
      <button onClick={payload}>Payload</button>
    </>
  );
};

export default Deposit;
