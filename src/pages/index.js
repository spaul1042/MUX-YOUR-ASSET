import { useState } from "react";
import styles from "@/styles/Home.module.css";
import NavBar from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import Image from 'next/image'



function Home() {
  return (
    <>
      <NavBar />

      <div>
        <Carousel>
          <Carousel.Item>
            <Image
              className="d-block w-100"
              width={200} 
              height={700}
              // src="https://picsum.photos/800/400?text=First slide&bg=373940"
              src='/Mux1.jpg'
              alt="First slide"
            />
            <Carousel.Caption>
              <h3 className={styles.txt1}>Welcome to MUX-UR-ASSET Platform</h3>
              <p className={styles.txt2}>
                MUX-UR-ASSET is a decentralized P2P lending platform which
                allows you to borrow and lend money without the need for a
                centralized intermediary. By using XRP Decenralized Blockchain
                Technology, we enable peer-to-peer lending with transparent and
                secure transactions. We make P2P Lending more risk resistant and
                more fun !",
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              width={200} 
              height={700}
              // src="https://picsum.photos/800/400?text=Second slide&bg=282c34"
              src='/Mux2.png'
              alt="Second slide"
            />

            <Carousel.Caption>
              <h3>Low Interest Rates</h3>
              <p>
                Whether you're looking to borrow money at a lower interest rate
                or lend money to earn higher returns, our platform provides a
                decentralized alternative to traditional P2P lending. Also you
                can choose to fund more than one loans at a time",
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              width={200} 
              height={700}
              src='/Mux3.jpg'
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>Risk Resistance and Tranparency</h3>
              <p>
                We follow overcollaterized lending norms. We also strictyly
                adhere to transparency norms between all the borrowers and
                lenders, so that you can yourself choose the loans you want to
                fund. Finally, we apply a decentralized Funding
                algorithm to optimally distribute your funding anount amongst the loans you have chosen.{" "}
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
}

export default Home;
