import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CertificateABI, certificateContractAddress } from "@/constants";

// Custom hook for setInterval with cleanup
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const CertificatesCounter = () => {
  const [certificateCount, setCertificateCount] = useState(0);
  const [certificateLength, setCertificateLength] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const provider = new ethers.providers.WebSocketProvider(
        "wss://sepolia.infura.io/ws/v3/0aa8c89265604a2684abddfb063e3b42"
      );
      const contract = new ethers.Contract(
        certificateContractAddress,
        CertificateABI,
        provider
      );

      contract.getAllCertificates().then((certificates) => {
        setCertificateLength(certificates.length);
        console.log(certificates.length);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useInterval(() => {
    if (certificateCount < certificateLength) {
      setCertificateCount((prevCount) => prevCount + 1);
    }
  }, 150); // Interval duration in milliseconds

  return (
    <>
      <div className="flex-row lg:flex-col items-center justify-center">
        <span className="text-lg lg:text-4xl w-full lg:w-1/2 font-bold text-center">
          Certificates Issued
        </span>
        <h3 className="text-lg lg:text-3xl">{certificateCount}</h3>
      </div>
    </>
  );
};

export default CertificatesCounter;
