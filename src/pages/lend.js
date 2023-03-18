import styles from "@/styles/Lend.module.css";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import loan from "../../server/models/loan";

// Note that here borrowers refer to loans >> Bcz a lender a going to fund a loan

export default function Lend() {
  const [loading, setloading] = useState(true);

  const [borrowers, setBorrowers] = useState([]);
  const [selectedBorrowers, setSelectedBorrowers] = useState([]);

  const toggleBorrowerSelection = (borrower) => {
    if (selectedBorrowers.includes(borrower)) {
      setSelectedBorrowers(
        selectedBorrowers.filter((curr_borrower) => curr_borrower != borrower)
      );
    } else {
      setSelectedBorrowers([...selectedBorrowers, borrower]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/loans');
        const data = await response.json();
        setBorrowers(data.active_loans);
        console.log("Success");
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setloading(false);
      }
    };
    fetchData();
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
      <NavBar />
      <div className={styles.borrowersContainer}>
        <h2 className={styles.subTitle}>Borrowers List:</h2>
        {borrowers.length > 0 ? (
          <ul className={styles.list}>
            {borrowers.map((borrower, index) => (
              <li key={index} className={styles.listItem}>
                <div className={styles.borrower}>
                  <span className={styles.name}>
                    {borrower.account_address}
                  </span>
                  <span className={styles.amount}>
                    {borrower.loan_amount} {borrower.currency_code} Tokens
                  </span>
                  <span className={styles.amount}>
                    {borrower.interest_rate} % for {borrower.loan_duration} months
                  </span>
                  <span className={styles.amount}>
                    Collateral Staked in {borrower.collateral_currency_code}
                  </span>
                  <button
                    className={`${styles.toggleButton} ${
                      selectedBorrowers.includes(borrower)
                        ? styles.selectedToggleButton
                        : ""
                    }`}
                    onClick={() => toggleBorrowerSelection(borrower)}
                  >
                  {selectedBorrowers.includes(borrower) ? "Remove" : "Add"}
                  
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowers registered yet.</p>
        )}
      </div>



    </>
  );
}
