import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import NavBar from "../components/NavBar";
const xrpl = require("xrpl");

// XRP, MUX, XUM Tokens
// Value of all these are same means if you want take a loan of amount X(of any token), you should have an amount>=X of the other token

function Home() {
  const [balances, setBalances] = useState([0, 0]);

  
  return (
    <>
      <NavBar />
      
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
