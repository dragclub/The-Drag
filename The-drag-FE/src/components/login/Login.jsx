import React, { useEffect, useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import eye from '../../assets/eye.svg'
import dotenv from 'dotenv'
dotenv.config();


const Login = ({ setResponse }) => {
    
    const [name,setname]=useState("");
    const [state, setstate] = useState('signup');
    const [visible, setvisible] = useState(false);
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [clicked, setclicked] = useState(false);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [isChecked, setIsChecked] = useState(false);

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
            setErrorMessageEmail('');
        } else {
            setIsValidEmail(false);
            setErrorMessageEmail('Please enter a valid email address');
        }
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;
        const number = /[0-9]/;

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!specialChar.test(password)) {
            return 'Password must contain at least one special character';
        }
        if (!upperCase.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!lowerCase.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!number.test(password)) {
            return 'Password must contain at least one number';
        }
        return '';
    };
    useEffect(() => {

        const password = document.getElementById('password');
        if (visible) {
            password.setAttribute('type', 'text');
        }
        else {

            password.setAttribute('type', 'password');
        }
    }, [visible]);
   

    const handlelogin = async () => {
        const formdata = {

            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }


        await fetch(`${process.env.REACT_APP_BASE_URL}v1/apis/login`, {
            credentials: 'include',
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify(formdata)
        }).then((res) => {  return res.json(); }).then((res) => {
            
            if (res.success) {
                alert("You are Successfully Logged In");
                sessionStorage.setItem('State', 'login');
                setResponse(res.iscreator, sessionStorage.getItem('State'));
                sessionStorage.setItem('creator', res.iscreator);
                sessionStorage.setItem('email', res.email);
                window.location.reload();
            }
            else {
                alert(res.error);
            }

        })



    }
    const handleChange = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);

        const error = validatePassword(inputPassword);
        setErrorMessage(error);
        setIsValid(!error);
    };
    const handlePassword = (e) => {
        if (e.target.value.length == 0 && (!clicked)) {
            alert(`Password Should include:
        * Password must be at least 8 characters long.
        * Password must contain at least one special character.
        * Password must contain at least one uppercase letter.
        * Password must contain at least one lowercase letter.
        * Password must contain at least one number.`
            )
            setclicked(true);
        }
    }

    const handlesignup = async (e) => {
        e.preventDefault();
        if (isValid && isValidEmail) {
            const formdata = {
              name,
              email,
              password,
              isChecked,
            };

            await fetch(`${process.env.REACT_APP_BASE_URL}v1/apis/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json"
                },
                body: JSON.stringify(formdata),
                credentials: 'include'

            }).then((res) => res.json()).then(res => {
                if (res.success) {
                    sessionStorage.setItem('State', 'login');
                    setResponse(res.iscreator, sessionStorage.getItem('State'));
                    sessionStorage.setItem('creator', res.iscreator);
                    sessionStorage.setItem('email', res.email);
                    alert("Sign Up Sucessfull!")
                    window.location.reload();
                }
                else {
                    alert(res.error);
                }
            })

        }
        else if (isValidEmail) {

            alert(`Password is Invalid`);

        }
        else if (isValid) {
            alert('Email is Invalid');
        }
        else {
            alert(`Password and Email are Invalid`);
        }
    }

    return (
      <div className="login-container">
        <div className="top-logo">
          <img src={logo} alt="" />
        </div>
        <div className="main-part">
          <div className="main-part-left">
            {state === "signup" ? <h1>Sign Up</h1> : <h1>Log In</h1>}
            <div>
              {state === "signup" ? (
                <p className="heading">Create an Account</p>
              ) : (
                <p className="heading">Welcome Back!</p>
              )}
              <br />
              {state === "signup" ? (
                <p className="login">
                  Already have an account?
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setstate("login")}
                  >
                    <strong>Log In</strong>
                  </span>
                </p>
              ) : (
                <p className="login">
                  Don't have an account?
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setstate("signup")}
                  >
                    <strong>Sign Up</strong>
                  </span>
                </p>
              )}
            </div>
            {state === "signup" ? (
              <form onSubmit={(e) => handlesignup(e)}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onInput={(e) => {
                      handleEmail(e);
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: isValidEmail ? "green" : "red",
                    }}
                  >
                    {isValidEmail ? "Email is valid" : errorMessageEmail}
                  </div>
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onClick={(e) => handlePassword(e)}
                      onChange={handleChange}
                    />

                    <img
                      onClick={() => {
                        setvisible(!visible);
                      }}
                      src={eye}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: isValid ? "green" : "red",
                    }}
                  >
                    {isValid ? "Password is valid" : errorMessage}
                  </div>
                </div>
                <p className="brand-box">
                  <input type="checkbox" onChange={handleCheckboxChange} />
                  <p>check if you are a brand</p>
                </p>
                <button type="submit">Sign Up</button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  handlelogin();
                  e.preventDefault();
                }}
              >
                <div>
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <img
                    onClick={() => {
                      setvisible(!visible);
                    }}
                    src={eye}
                    alt="show"
                  />
                </div>
                <button type="submit">Log In</button>
              </form>
            )}
          </div>
          <div className="main-part-right">
            <img src={logo} alt="" />
          </div>
        </div>
      </div>
    );
}

export default Login
