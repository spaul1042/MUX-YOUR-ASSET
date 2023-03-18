import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";


function NavBar() {
  const [loading, setloading] = useState(false);
  const [appname, setAppName] = useState("App Name ?");
  const [balances , setBalances] = useState([0, 0]);
  const [connected, setConnected] = useState(false);

  // const [res, setRes] = useState();

  const [xumm, setXumm] = useState();
  // useEffect(() => {
  //   // The js code which needs to be run once the component gets mounted
    
  // }, []);

  const connect = async function () {
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, // Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });
    await xumm.authorize().catch((e) => console.log("e", e));
    setConnected(true);
  };

  const payload = async function () {
    const sdk = new Xumm(
      "9f7539a1-f077-4098-8fee-dfc371769a15",
      "5bb59cad-d471-4d0f-8c06-b0463a78eeff"
    );

    const appinfo = await sdk.ping();

    const request = {
      "TransactionType": "Payment",
      "Destination": "rph8nukqhbkdRLk2L7XcrzM49uMgMNm47M",
      "Amount": "10000",
      "Memos": [
        {
          "Memo": {
            "MemoData": "F09F988E20596F7520726F636B21"
          }
        }
      ]
    }

    const payload = await sdk.payload.create(request, true)

    // console.log(payload)
    alert("Click Ok to get the qr code for signing transactions");
    alert(payload.refs.qr_png);
    console.log(payload.refs.qr_png)

    setAppName(appinfo.application.name);
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
          <li>
            <div className={styles.connectbtn}>
              <button onClick={payload}>Get App Name</button>
            </div>
          </li>
        </ul>
        <div>{appname} </div>
        <div className={styles.connectbtn}>
          <button onClick={connect}>Connect Wallet </button>
        </div>
      </nav>
      <div></div>
    </>
  );
}

export default NavBar;
