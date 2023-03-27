import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";
import Image from "next/image";

function NavBar() {
  const [loading, setloading] = useState(false);
  const [address , setAddress] = useState("Please connect wallet")
  const [connected , setConnected] = useState(false);

  const connect = async function () {
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, 
      redirectUrl: document.location.href + '?custom_state=test'// Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });
    await xumm.authorize().catch((e) => console.log("e", e));
    console.log("Authorized");
    setConnected(true);

  };

  const disconnect = async function () {

    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, 
      redirectUrl: document.location.href + '?custom_state=test'// Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });
    
    console.log("Before logging out");
    await xumm.logout();
    console.log("logged out");

    setConnected(false);
  
  };


  useEffect(() => {

    setloading(true);

    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, 
      redirectUrl: document.location.href + '?custom_state=test'// Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });

    xumm.on("error", (error) => {
      console.log("error", error);
    });

    xumm.on("success", async () => {
      // the asycn function is called when the authentication/login is successful which fetches account address and sets it.
      xumm.user.account.then(account => {
        setAddress(account);
        setConnected(true);
      })
    });
    
    xumm.on("retrieved", async () => {
      // this async function is called, when the user tries to retrieve the xumm api data, for example if the user is connected 
      // async function >> xumm.user.account.then returns the account address as a promise
      // xumm.user.account.then(account => {
      //   console.log("refreshed visit")
      //   setAddress(account);
      //   setConnected(true);
      // })
      setConnected(true);
    });

    setloading(false);
    // return () => {
    //   // Clean up any resources (e.g. event listeners) that were set up in this useEffect
    //   xumm.destroy();
    // };

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
      <nav className={styles.nav}>
        <ul>
          <Image
            className={styles.img}
            width={100}
            height={40}
            src="/MUXUR.png"
            alt="First slide"
          />
          <div className={styles.txt}>MUX-UR-ASSET</div>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/lend">Lend</Link>
          </li>
          <li>
            <Link href="/borrow">Borrow</Link>
          </li>
          <li>
            <Link href="/myprofile">My Profile</Link>
          </li>
        </ul>

        <div className={styles.connectbtn}>
          {connected? <button onClick={disconnect} disabled> Disconnect Wallet </button>
          : <button onClick={connect}> Connect Wallet </button>}
          
        </div>
      </nav>
      <div></div>
    </>
  );
}

export default NavBar;
