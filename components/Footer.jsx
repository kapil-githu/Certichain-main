"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "@/styles";
import { footerVariants } from "@/utils/motion";
import Link from "next/link";

const Footer = () => {
  const [theme, setTheme] = React.useState("");
  React.useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").matches ? setTheme("dark") : setTheme("light");
  }, [theme]);
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} md:py-8 relative`}
    >
      <div className="footer-gradient" />
      <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
        <div className="flex flex-col">
          <div className={`my-14 h-[2px] bg-white opacity-10`} />
          <div className="flex items-center justify-between flex-col mb-4 text-center md:flex-row gap-4">
            {/* <h4 className="font-extrabold text-[24px] text-gray-900 dark:text-white"> */}
            <h4 className="font-extrabold text-[24px] label-text">
              CERTICHAIN
            </h4>
            {/* <Link href={"/admin-login"}>Admin Login</Link> */}
            {/* <p className="font-normal text-[12px] text-center md:text-[14px] label-text opacity-50">
              Copyright © {new Date().getFullYear()} -{" "}
              {new Date().getFullYear() + 1} Certi-Block. All rights reserved.
            </p> */}

            <div className="flex gap-1">
              Made with <span className="text-[#FF0000]"></span>a Vision
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;