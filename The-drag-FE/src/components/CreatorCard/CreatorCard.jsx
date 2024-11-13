
import React from "react";
import "./CreatorCard.css";
import Popup from "reactjs-popup";
import Contact from "../Contact/Contact";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaTwitterSquare,
} from "react-icons/fa";

const CreatorCard = ({ props }) => {
  const {
    name,
    image,
    email,
    instaurl,
    instacount,
    facebookurl,
    facebookcount,
    youtubeurl,
    youtubecount,
    twitterurl,
    twittercount,
    linkedinurl,
    linkedincount,
  } = props;

  const totalsum =
    instacount + facebookcount + youtubecount + twittercount + linkedincount;
  const totalk = Math.floor(totalsum / 1000);

  return (
    <div className="creator-card">
      <img src={image} alt={name} className="creator-image" />
      <div className="creator-info">
        <div className="creator">
          <div className="creator-total">
            <h3 className="creator-name">{name}</h3>
            <p className="total-followers">
              Total Followers {totalk ? `${totalk}K` : totalsum}
            </p>
          </div>
          {/* <div className="highest">
            <p className="follower"> {totalk}</p>
            <p className="platform">Instagram</p>
          </div> */}
        </div>

        <div className="contact">
          <div className="social-icons">
            {instaurl && (
              <a href={instaurl} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}
            {facebookurl && (
              <a href={facebookurl} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            )}
            {youtubeurl && (
              <a href={youtubeurl} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            )}
            {linkedinurl && (
              <a href={youtubeurl} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            )}
            {twitterurl && (
              <a href={youtubeurl} target="_blank" rel="noopener noreferrer">
                <FaTwitterSquare />
              </a>
            )}
          </div>
          {sessionStorage.getItem("State") === "logout" ? (
            <button
              type="button"
              className="contact-btn"
              onClick={() => alert("Please Login First!")}
            >
              Contact
            </button>
          ) : (
            <Popup
              trigger={<button className="contact-btn">Contact</button>}
              modal
              position="top center"
            >
              {(close) => <Contact email={email} name={name} close={close} />}
            </Popup>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;

