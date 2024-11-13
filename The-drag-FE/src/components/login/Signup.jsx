import React, { useEffect, useState } from 'react'
import "./Signup.css"
import eye from "../../assets/eye.svg";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
export const Signup = ({ setResponse }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setname] = useState("");
  const [state, setstate] = useState("signup");
  const [visible, setvisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clicked, setclicked] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const validateEmail = (email) => {
    // Basic email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  const handleEmail = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (validateEmail(inputEmail)) {
      setIsValidEmail(true);
      setErrorMessageEmail("");
    } else {
      setIsValidEmail(false);
      setErrorMessageEmail("Please enter a valid email address");
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!specialChar.test(password)) {
      return "Password must contain at least one special character";
    }
    if (!upperCase.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!lowerCase.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!number.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };
  useEffect(() => {
    const password = document.getElementById("password");
    if (visible) {
      password.setAttribute("type", "text");
    } else {
      password.setAttribute("type", "password");
    }
  }, [visible]);
  // let name="";
  // let email="";
  // let password="";

  const handlelogin = async () => {
    const formdata = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    await fetch(`${process.env.REACT_APP_BASE_URL}v1/apis/login`, {
      credentials: "include",
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formdata),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log("login response", res);
        if (res.success) {
          alert("You are Successfully Logged In");
          sessionStorage.setItem("State", "login");
          console.log(res.iscreator);
          setResponse(res.iscreator, sessionStorage.getItem("State"));
          sessionStorage.setItem("creator", res.iscreator);
          sessionStorage.setItem("email", res.email);
          window.location.reload();
        } else {
          alert(res.error);
        }
      });
  };
  const handleChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);

    const error = validatePassword(inputPassword);
    setErrorMessage(error);
    setIsValid(!error);
  };
  const handlePassword = (e) => {
    if (e.target.value.length == 0 && !clicked) {
      alert(`Password Should include:
        * Password must be at least 8 characters long.
        * Password must contain at least one special character.
        * Password must contain at least one uppercase letter.
        * Password must contain at least one lowercase letter.
        * Password must contain at least one number.`);
      setclicked(true);
    }
  };

  const handlesignup = async (e) => {
    e.preventDefault();
    if (isValid && isValidEmail) {
      const formdata = {
        name,
        email,
        password,
        isChecked,
      };
      console.log("formdata",formdata)
      await fetch(`${process.env.REACT_APP_BASE_URL}v1/apis/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formdata),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            sessionStorage.setItem("State", "login");
            setResponse(res.iscreator, sessionStorage.getItem("State"));
            sessionStorage.setItem("creator", res.iscreator);
            sessionStorage.setItem("email", res.email);
            alert("Sign Up Sucessfull!");
            window.location.reload();
          } else {
            alert(res.error);
          }
        });
    } else if (isValidEmail) {
      alert(`Password is Invalid`);
    } else if (isValid) {
      alert("Email is Invalid");
    } else {
      alert(`Password and Email are Invalid`);
    }
  };
  return (
    <section className={`auth-wrapper ${isLogin ? "auth-active" : ""}`}>
      <div className="auth-form auth-signup">
        <header onClick={() => setIsLogin(false)}>Signup</header>
        <form onSubmit={(e) => handlesignup(e)}>
          <input
            type="text"
            placeholder="Full name"
            required
            name="name"
            id="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <input
            placeholder="Email address"
            type="email"
            name="email"
            id="email"
            value={email}
            onInput={(e) => {
              handleEmail(e);
            }}
            required
          />
          <div
            style={{
              fontSize: "12px",
              color: isValidEmail ? "green" : "red",
            }}
          >
            {isValidEmail ? "Email is valid" : errorMessageEmail}
          </div>
          <div className="password">
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onClick={(e) => handlePassword(e)}
              onChange={handleChange}
              required
            />
            {/* <span
              onClick={() => {setShowPassword((prev) => !prev)
                setvisible(!visible);
              }}
              className=" eye absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span> */}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: isValid ? "green" : "red",
            }}
          >
            {isValid ? "Password is valid" : errorMessage}
          </div>

          <div className="auth-checkbox">
            <input
              type="checkbox"
              id="auth-signupCheck"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="auth-signupCheck">Signup as a Brand</label>
          </div>
          <input type="submit" value="Signup" />
        </form>
      </div>

      <div className="auth-form auth-login">
        <header onClick={() => setIsLogin(true)}>Login</header>
        <form
          onSubmit={(e) => {
            handlelogin();
            e.preventDefault();
          }}
        >
          <input
            placeholder="Email address"
            required
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <a href="#">Forgot password?</a> */}
          <input type="submit" value="Login" />
        </form>
      </div>
    </section>
  );
};
