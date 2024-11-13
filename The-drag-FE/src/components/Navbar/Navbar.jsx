import React, { useEffect, useState } from "react";
import './Navbar.css'
import logo from '../../assets/logo.png'
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import Login from "../login/Login";
import Update from "../Update/Update";
import dotnenv from 'dotenv'
import { GiHamburgerMenu } from "react-icons/gi";
import CreatorRegistration from "../Register/CreatorRegistraion";
import UpdateCreator from "../Update/UpdateCreator";
import { Signup } from "../login/Signup";
dotnenv.config();



const Navbar = ({ SetBlur }) => {
  const [State, setState] = useState(sessionStorage.getItem("State"));
  const [creator, setcreator] = useState(sessionStorage.getItem("creator"));

  const [isOpen, setIsOpen] = useState(false);
   const [isBlurred, setIsBlurred] = useState(false);

   const toggleBlur = () => {
     setIsBlurred((prev) => !prev);
   };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const fetchdata = (data, st) => {
    setcreator(data);
    setState(st);
  };

  const logout = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}v1/apis/logout`, {
      method: "post",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        sessionStorage.setItem("State", "logout");
        sessionStorage.removeItem("creator");
        sessionStorage.removeItem("email");
        alert(res.message);
        setState(sessionStorage.getItem("State"));
        window.location.reload();
      });
  };

  return (
    <div className={`nav-container ${isBlurred ? "blurred" : ""}`}>
      <div className="navbar">
        <div className="nav">
          <div className="nav-links">
            <Link
              to="/"

              className="nav-logo-container"
            >
              <img src={logo} alt="Logo" className="nav-logo" />
            </Link>
            <Link to="/creators" className="nav-link">
              Creators
            </Link>
            <Link to="/deals" className="nav-link">
              Deals
            </Link>
          </div>
        </div>

        <div className="nav-icons-list">
          {State === "login" ? (
            creator === "true" ? (
              <Popup
                trigger={
                  <button type="button" className="nav-btn">
                    Update Creator Id
                  </button>
                }
                closeOnDocumentClick={false}
                onOpen={() => SetBlur(true)}
                onClose={() => SetBlur(false)}
                modal
              >
                {(close) => <UpdateCreator close={close} />}
              </Popup>
            ) : creator === "false" ? (
              <Popup
                trigger={
                  <button type="button" className="nav-btn">
                    Register as Creator
                  </button>
                }
                closeOnDocumentClick={false}
                modal
                onOpen={() => SetBlur(true)}
                onClose={() => SetBlur(false)}
                nested
              >
                {(close) => <CreatorRegistration close={close} />}
              </Popup>
            ) : (
              <button type="button" className="nav-btn">
                Waiting for Approval
              </button>
            )
          ) : (
            <></>
          )}
          {State !== "login" ? (
            <Popup
              className="login-popup"
              trigger={
                <button type="button" className="nav-btn">
                  Sign Up/ Login
                </button>
              }
              modal
              onOpen={() => SetBlur(true)}
              onClose={() => SetBlur(false)}
            >
              {(close) => <Signup setResponse={fetchdata} />}
            </Popup>
          ) : (
            <button type="button" className="nav-btn" onClick={logout}>
              Log Out
            </button>
          )}
        </div>
        <div onClick={toggleMenu} className="hamburger-icon">
          <GiHamburgerMenu size={24} />
        </div>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div>
            <Link to="/" className="nav-logo-container">
              <img src={logo} alt="Logo" className="nav-logo" />
            </Link>
          </div>

          <div className="hamburger-links">
            <Link
              to="/creators"
              className="hamburger-link"
              onClick={toggleMenu}
            >
              Creators
            </Link>
            <Link to="/deals" className="hamburger-link" onClick={toggleMenu}>
              Deals
            </Link>
            {State === "login" ? (
              creator === "true" ? (
                <Popup
                  trigger={
                    <p
                      type="button"
                      className="hamburger-link"
                      onClick={toggleMenu}
                    >
                      Update Creator Id
                    </p>
                  }
                  closeOnDocumentClick={false}
                  onOpen={() => SetBlur(true)}
                  onClose={() => SetBlur(false)}
                  modal
                >
                  {(close) => <UpdateCreator close={close} />}
                </Popup>
              ) : creator === "false" ? (
                <Popup
                  trigger={
                    <p
                      type="button"
                      className="hamburger-link"
                      onClick={toggleMenu}
                    >
                      Register as Creator
                    </p>
                  }
                  closeOnDocumentClick={false}
                  onOpen={() => SetBlur(true)}
                  onClose={() => SetBlur(false)}
                  modal
                  nested
                >
                  {(close) => <CreatorRegistration close={close} />}
                </Popup>
              ) : (
                <p type="button" className="hamburger-link">
                  Waiting for Approval
                </p>
              )
            ) : (
              <></>
            )}
            {State !== "login" ? (
              <Popup
                className="login-popup"
                trigger={
                  <p type="button" className="hamburger-link">
                    Sign Up/ Login
                  </p>
                }
                modal
                onOpen={() => SetBlur(true)}
                onClose={() => SetBlur(false)}
              >
                {(close) => <Signup setResponse={fetchdata} />}
              </Popup>
            ) : (
              <p
                type="button"
                className="hamburger-link"
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
              >
                Log Out
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
