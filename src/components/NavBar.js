import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Xumm } from "xumm";

function NavBar() {
  const [loading, setloading] = useState(false);
  const [appname, setAppName] = useState("App Name ?");

  // const [res, setRes] = useState();
  // useEffect(() => {
  //   // The js code which needs to be run once the component gets mounted
    
  // }, []);

  const connect = async function () {
    const xumm = new Xumm("9f7539a1-f077-4098-8fee-dfc371769a15", {
      implicit: true, // Implicit: allows to e.g. move from social browser to stock browser
      // redirectUrl: document.location.href + '?custom_state=test'
    });
    await xumm.authorize().catch((e) => console.log("e", e));
  };

  const payload = async function () {
    const xumm = new Xumm(
      "9f7539a1-f077-4098-8fee-dfc371769a15"
    );

    console.log("before payload");

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
 
    // createAnsSubscribe function returns {created:__, resolved:__} object which is then destructured in .then
    // createndSubscribe function also has an eventMesage associated with this
    xumm.payload.createAndSubscribe(request, eventMessage => {
      if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
        // Update the UI? The payload was opened.
        console.log("payload opened");
      }
      if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
        // The `signed` property is present, true (signed) / false (rejected)
        console.log("payload signed");
        return eventMessage
      }
    })
      .then(({ created, resolved }) => {
        // gets executed once the payload is created
        console.log('Payload URL:', created.next.always)
        console.log('Payload QR:', created.refs.qr_png)
    
        return resolved // Return payload promise for the next `then`
      })
      .then(payload => {
        // gets executed once the payload is signed
        console.log('Payload resolved', payload)
      })  // after the payload has been signed by the user 


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
