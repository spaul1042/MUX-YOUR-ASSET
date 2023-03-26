import styles from "@/styles/Deposit.module.css";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";
import { AccountRootFlags } from "xrpl/dist/npm/models/ledger";
// {account_address, currency_code, collateral_amount}
const Deposit = () => {
  //  currency code : XRP, MUX, XUM
  // Issuer of MUX and XUM is same

  const [loading, setloading] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [currency_code, setCode] = useState("");
  const [collateral_amount, setAmount] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (accountAddress.length != 34 || accountAddress[0] != "r") {
      alert(
        "Account Address Not valid, remove spaces/enter a valid account address of length 34"
      );
      return;
    }
    const url = new URL("http://localhost:8000/api/check_register");
    url.searchParams.set("account_address", accountAddress);

    const chk_register_response = await fetch(
      "http://localhost:8000/api/check_register?" +
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
    const data = await chk_register_response.json();
    console.log(data);
    // if (!chk_register_response.message) {
    //   console.log("user not registered");
    //   alert("User not regitered");
    //   return;
    // }

    if (chk_register_response.status === 400) {
      console.log("user not registered");
      alert("User not regitered");
      return;
    }
    setloading(true);

    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15");

    const intermediary_account = "ra26ykT87BwwEriSdyoMbDcKPdaNpRnaoS"; // Name on Account on Xumm Wallet -> Test
    // this is the intermediary account on MUX-YOUR-ASSET software, where all the collateral is deposited and defaulting repayments happens
    const issuer_account = "r9ipnvUgT4ZYVbiNib4sLCzJ3RGzxfXp6y";
    // this is the account which has issued the MUX and XUM token
    console.log("before payload");

    let send_token_tx = {
      TransactionType: "Payment",
      Account: accountAddress,
      Amount: {
        currency: currency_code,
        value: collateral_amount,
        issuer: issuer_account,
      },
      Destination: intermediary_account,
    };

    if (currency_code == "XRP") {
      send_token_tx = {
        TransactionType: "Payment",
        Account: accountAddress,
        Amount: (collateral_amount * 1000000).toString(),
        Destination: intermediary_account,
      };
    }

    //payload gets created with an event associated with it
    xumm.payload
      .createAndSubscribe(send_token_tx, (eventMessage) => {
        if (Object.keys(eventMessage.data).indexOf("opened") > -1) {
          // Update the UI? after the payload was opened.
        }
        if (Object.keys(eventMessage.data).indexOf("signed") > -1) {
          // The `signed` property is present, true (signed) / false (rejected)
          return eventMessage;
        }
      })
      .then(({ created, resolved }) => {
        //  called after payload creation
        // Update UI after payload ceation
        alert(created.refs.qr_png);
        console.log("Payload URL:", created.next.always);
        console.log("Payload QR:", created.refs.qr_png);

        return resolved; // Return payload promise for the next `then`
      })
      .then((payload) => {
        // Called when the payload was signed
        // Update UI after payload is signed
        // Updating the database
        console.log("Updating database");
        const response = fetch("http://localhost:8000/api/deposit_collateral", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_address: accountAddress,
            currency_code: currency_code,
            collateral_amount: collateral_amount,
          }),
        });

        return response;
      })
      .then((response) => {
        if (response.ok) {
          console.log("Success");
          alert("Successfully deposited Collateral");
          // handle successful operation
        } else {
          console.log("failure");
          alert("Collateral not deposited because of an error");
          // handle failed operation
        }
        setloading(false);
      });
  };

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

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.h2}> Deposit Collateral </h2>
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
          <select
            id="name"
            type="text"
            value={currency_code}
            onChange={(event) => setCode(event.target.value)}
            className={styles.input}
            required
          >
            <option value="XRP">XRP</option>
            <option value="MUX">MUX</option>
            <option value="XUM">XUM</option>
          </select>
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
