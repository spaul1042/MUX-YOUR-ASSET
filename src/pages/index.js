import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import NavBar from "../components/NavBar";
const xrpl = require("xrpl");

// XRP, MUX, XUM Tokens
// Value of all these are same means if you want take a loan of amount X(of any token), you should have an amount>=X of the other token

function Home() {
  const [balances, setBalances] = useState([0, 0]);

  const getBalances = async function () {
    const client = await new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const wallet1 = xrpl.Wallet.fromSeed("sEdTskLnmN6XVoQVsyUYF7E7gXLiEQx");
    const wallet2 = xrpl.Wallet.fromSeed("sEdSLd9Xz8qpvdnJEMX3qWjYukSfHdD");

    const balance1 = await client.getXrpBalance(wallet1.address);
    const balance2 = await client.getXrpBalance(wallet2.address);

    setBalances([balance1, balance2]);

    await client.disconnect();
  };

  const send = async function () {
    const client = await new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const wallet1 = await xrpl.Wallet.fromSeed(
      "sEdTskLnmN6XVoQVsyUYF7E7gXLiEQx"
    );
    const wallet2 = await xrpl.Wallet.fromSeed(
      "sEdSLd9Xz8qpvdnJEMX3qWjYukSfHdD"
    );

    const prepared = await client.autofill({
      TransactionType: "Payment",
      Account: wallet1.address,
      Amount: 10000000,
      Destination: wallet2.address,
    });
    const signed = await wallet1.sign(prepared);
    const tx = await client.submitAndWait(signed.tx_blob);

    // setBalances([wallet1.address, wallet2.address])
    console.log(wallet1.address);

    client.disconnect();
  };
  return (
    <>
      <NavBar />
      <div className={styles.connectbtn}>
        <button onClick={getBalances}>Get Balances</button>
      </div>
      <div className={styles.connectbtn}>
        <button onClick={send}>Tranfer from Account 1 to Acount 2 </button>
      </div>
      Balance1 : {balances[0]} Balance2 :{balances[1]}
      <main className={styles.main}>
        <h1 className={styles.h1}>
          Welcome to our Decentralized Lending Platform
        </h1>
        <p className={styles.p}>
          MUX-YOUR-XRD, a lending platform allows you to borrow and lend money
          without the need for a centralized intermediary. By using smart
          contracts on a blockchain network, we enable peer-to-peer lending with
          transparent and secure transactions. We make P2P Lending more risk
          resistant and more fun !
        </p>
        <p>
          Whether you're looking to borrow money at a lower interest rate or
          lend money to earn higher returns, our platform provides a
          decentralized alternative to traditional lending.
        </p>
      </main>
    </>
  );
}

export default Home;
