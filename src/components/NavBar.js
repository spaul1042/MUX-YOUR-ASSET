import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import {Xumm} from "xumm";

function NavBar() {
  const [loading, setloading] = useState(true);
  const [res, setRes] = useState();
  
  useEffect(() => {

    // The js code which needs to be run once the component gets mounted
    // const xumm = new XummPkce('9f7539a1-f077-4098-8fee-dfc371769a15', {
    //   implicit: true, // Implicit: allows to e.g. move from social browser to stock browser
    //   redirectUrl: document.location.href + '?custom_state=test'
    // })

    const xumm = new Xumm('9f7539a1-f077-4098-8fee-dfc371769a15', {
        implicit: true, // Implicit: allows to e.g. move from social browser to stock browser
        redirectUrl: document.location.href + '?custom_state=test'
      });
  ;

    async function main() {
      await xumm.authorize().catch(e => console.log('e', e));
      setloading(false);
    }
    main();
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
            <Link href="/">My Profile</Link>
          </li>
        </ul>
        <div className={styles.connectbtn}>
          <radix-connect-button />
        </div>
      </nav>
      <div>
        {res}
      </div>
    </>
  );
}

export default NavBar;
