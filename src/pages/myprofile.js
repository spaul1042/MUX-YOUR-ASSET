import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/MyProfile.module.css";
import NavBar from "../components/NavBar";

function MyProfile() {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Your Profile</h1>

        <Link className={styles.button1} href="/signin">
          Register your account!
        </Link>

        <Link className={styles.button1} href="/deposit">
          Deposit Collateral
        </Link>
      </div>
    </>
  );
}

export default MyProfile;
