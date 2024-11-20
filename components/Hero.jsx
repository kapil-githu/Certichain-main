"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles";
import { counterVariants, staggerContainer, textVariant } from "@/utils/motion";
import toast from "react-hot-toast";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "@/config/firebase";
import InstitutesCounter from "./InstitutesCounter";
import CertificatesCounter from "./CertificatesCounter";

const Hero = () => {
  const [show, setShow] = React.useState(false);
  const [account, setAccount] = React.useState("");
  const [data, setData] = React.useState({});
  const [prefersDarkMode, setPrefersDarkMode] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersDarkMode(
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  }, []);

  const handleLogin = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // detect what network is the account linked to
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    // check if chainId matches with Sepolia network
    console.log(chainId);
    if (chainId !== "0xaa36a7") {
      toast.error("Please switch to Sepolia Testnet");
    } else {
      console.log(accounts[0]);
      setAccount(accounts[0]);
      const docRef = doc(db, "institutes", accounts[0].toLowerCase());
      getDoc(docRef).then((data) => {
        if (data.exists()) {
          setData(data.data());
          document.getElementById("login_modal").close();
          document.getElementById("otp_modal").showModal();
        } else {
          document.getElementById("login_modal").close();
          toast.error("You are not authorized to issue certificates");
        }
      });
      setShow(true);
    }
  };

  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef()]; // Refs for each input field

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field if a number is entered
    if (value.length === 1 && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (index > 0) {
        // Move focus to the previous input field
        refs[index - 1].current.focus();
      }
      // Clear the value of the current input field
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const onSubmit = (otp) => {
    if (otp === data?.pin) {
      toast.success("PIN Verified");
      document.getElementById("otp_modal").close();
      sessionStorage.setItem("address", account.toLowerCase());
      window.location.href = "/institutes/" + account.toLowerCase();
    } else {
      toast.error("Invalid PIN, Please try again!");
      setOtp(["", "", "", ""]);
      refs[0].current.focus();
    }
  };

  const [count, setCount] = useState(0);
  const [docsLength, setDocsLength] = useState(0);
  React.useEffect(() => {
    const colRef = collection(db, "institutes");
    getDocs(colRef).then((snapshot) => {
      setDocsLength(snapshot.size);
    });
  }, []);

  return (
    <>
      <div className="hero sm:mb-28 mb-0 md:min-h-[92vh]">
        <div className="hero-content text-center flex-col m-4 text-neutral-content">
          <div className="flex-col">
            <motion.div
              className={`${styles.innerWidth} flex items-center justify-center flex-col`}
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              <motion.div
                variants={textVariant(0.5)}
                className="hidden absolute lg:flex overflow-x-hidden h-[20%] blur-[40px] bg-gradient-to-r dark:from-purple-700 dark:via-teal-400 dark:to-purple-700 from-purple-400 via-teal-300 to-indigo-300 bg-opacity-50 w-1/2 rounded-xl"
              />

              <div className="flex justify-center items-center flex-col relative z-10">
                <motion.h1
                  variants={textVariant(0.5)}
                  className="mb-5 text-5xl label-text font-bold"
                  style={{
                    color: prefersDarkMode === true ? "white" : "black",
                  }}
                >
                  CERTICHAIN
                </motion.h1>
                <motion.p
                  variants={textVariant(0.7)}
                  className="mb-5 text-lg label-text"
                  style={{
                    color: prefersDarkMode === true ? "white" : "black",
                  }}
                >
                  Certichain is a blockchain-based certificate validation
                  system that provides a secure and reliable way to verify the
                  authenticity of certificates.
                </motion.p>
                <motion.div
                  variants={textVariant(0.9)}
                  className="flex flex-col lg:flex-row items-center justify-center mt-5"
                >
                  <button
                    className="btn btn-primary hover:scale-105 transition"
                    onClick={() =>
                      (window.location.href = "/validate-document")
                    }
                  >
                    Verify Certificates
                  </button>
                  <br />
                 <p>  </p>
                  <br />
                  <button
                    className="btn btn-secondary hover:scale-105 transition"
                    onClick={() => {
                      document.getElementById("login_modal").showModal();
                      handleLogin();
                    }}
                  >
                    Issue Certificates
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="items-center flex justify-evenly w-full">
          <div className="mt-[600px] lg:mt-[500px] ml-3 flex-row lg:flex-col justify-center cursor-default">
            <motion.div
              variants={counterVariants(1.5)}
              initial="hidden"
              whileHover={{ scale: 1.1, transition: {duration: 0.5, ease: "easeInOut"}}}
              className=" mt-8 border rounded-lg p-3 hover:bg-[#dbdbdb] dark:hover:bg-[#444] hover:text-black text-center dark:hover:text-white transition-all duration-300 ease-in-out"
              whileInView="show"
            >
              <InstitutesCounter
                count={count}
                setCount={setCount}
                docsLength={docsLength}
              />
            </motion.div>
          </div>
          <div className="mt-[600px] lg:mt-[500px] flex-col lg:flex-row justify-center cursor-default">
            <motion.div
              whileHover={{ scale: 1.1, transition: {duration: 0.5, ease: "easeInOut"}}}
              variants={counterVariants(1.5)}
              initial="hidden"
              className=" mt-8 border text-center rounded-lg p-3 hover:bg-[#dbdbdb] dark:hover:bg-[#444] hover:text-black dark:hover:text-white transition-all duration-100 ease-in-out"
              whileInView="show"
            >
              <CertificatesCounter />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <dialog id="login_modal" className="modal backdrop-blur">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Login to your Metamask Wallet Account
          </h3>
          <p className="py-4 text-md">
            Login to your Metamask Account on Sepolia Testnet
          </p>
          <div className="items-center flex justify-center flex-col">
            <span className="loading loading-ring w-20"></span>
            <p className="text-base">Waiting for your response...</p>
            {show === true ? (
              <>
                <div className="text-left">
                  <p className="text-sm lg:text-base">
                    Recieved Account from Metamask:{" "}
                    <b className="text-primary">{account}</b>
                  </p>
                  <p className="text-sm lg:text-base">
                    Please wait while we verify this account
                  </p>
                </div>
              </>
            ) : null}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error" id="close_login_modal">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* OTP Modal */}
      <dialog id="otp_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Enter PIN</h3>
          <div className="flex items-center justify-center flex-col space-y-3">
            <div className="space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={refs[index]} // Assign the ref to the input field
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:border-blue-500"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error" id="close_login_modal">
                    Cancel
                  </button>
                </form>
                <button
                  className="btn btn-success"
                  onClick={() => onSubmit(otp.join(""))}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Hero;
