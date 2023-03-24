import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";
import Image from "next/image";

function NavBar() {
  const [loading, setloading] = useState(false);

  const connect = async function () {
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, // Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });
    await xumm.authorize().catch((e) => console.log("e", e));
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
      <nav className={styles.nav}>
        <ul>
          <Image
            className={styles.img}
            width={100}
            height={40}
            src="/MUXUR.png"
            alt="First slide"
          />
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
          <button onClick={connect}>Connect Wallet </button>
        </div>
      </nav>
      <div></div>
    </>
  );
}

export default NavBar;
