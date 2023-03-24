import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/MyProfile.module.css";
import NavBar from "../components/NavBar";
import Card from "../components/Card";

function MyProfile() {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        {/* <h1 className={styles.title}>Welcome to Your Profile</h1> */}

        <Card
          title="Register your account!"
          description="Create an account to start using our platform."
          href="/signin"
          bgImage="path/to/register-image.jpg"
        />

        <Card
          title="Deposit Collateral"
          description="Deposit collateral to secure your loans."
          href="/deposit"
          bgImage="path/to/deposit-image.jpg"
        />
      </div>
      <div className={styles.container}>
        <Card
          title="Get your Loan Requests"
          description="View and manage your loan requests."
          href="/myloans"
          bgImage="path/to/loan-requests-image.jpg"
        />

        <Card
          title="Get your Funded Loans"
          description="View and manage your funded loans."
          href="/myfundings"
          bgImage="path/to/funded-loans-image.jpg"
        />
      </div>
    </>
  );
}

export default MyProfile;
