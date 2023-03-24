import styles from "@/styles/Card.module.css";
import Link from "next/link";


function Card({ title, description, href, bgImage }) {

  return (
    <div
      className={styles.card}
    //   style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Link className={styles.button} href={href}>
        {title}
      </Link>
    </div>
  );
}

export default Card;
