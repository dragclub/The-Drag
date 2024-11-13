import React from 'react'
import './Footer.css'

import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-upper">
        <div className="handle">
          <a href="https://www.instagram.com/thedrag.club/">
            <FaInstagram className="handle" />
          </a>
          <a href="">
            <FaFacebook className="handle" />
          </a>
          <a href="https://www.linkedin.com/company/thedrag/">
            <FaLinkedin className="handle" />
          </a>
          <a href="">
            <FaYoutube className="handle" />
          </a>
        </div>

        <p >DRAG</p>
      </div>
      <div
        className="query"
        style={{
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
          fontFamily: "poppins",
          fontSize: "20px",
          color: "#FAFAFA",
          fontWeight: "500",
        }}
      >
        <p style={{ textAlign: "center" }}>Queries: info@thedrag.in</p>
      </div>
    </div>
  );
}

export default Footer
