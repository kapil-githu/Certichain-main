"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";
import InstitutesAndCertificates from "@/components/InstitutesCounter";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <ContactUs /> */}
      <Footer />
    </>
  );
}
