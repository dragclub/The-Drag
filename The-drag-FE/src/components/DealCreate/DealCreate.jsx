import React, {useState } from 'react'
import './DealCreate.css'
import categories from '../../assets/categories'
import dotenv from 'dotenv'
import Dropdown from '../Dropdown/Dropdown'
import { IoClose } from 'react-icons/io5'


dotenv.config();
const DealCreate = ({ close }) => {

    const [isValid, setisValid] = useState(true);
    const [Visible, setVisible] = useState(false);
    const [input, setinput] = useState("");
    const [deal1, setdeal1] = useState(false);
    const [deal2, setdeal2] = useState(false);
    const [deal3, setdeal3] = useState(false);
    const [deal4, setdeal4] = useState(false);
    const setInput = (data, add) => {
        if (add) {
            if (input.length === 0) {
                setinput(data);
            }
            else {
                setinput(input + "," + data);
            }
        }
        else {
            if (input.length > 0) {
                let str = input, idx = input.indexOf(data);
                if (idx > 0) {
                    str = str.slice(0, idx - 1) + str.slice(idx + data.length);
                }
                else {
                    str = str.slice(idx + data.length + 1);
                }
                setinput(str);

            }
        }
    }

    const handlePhone = (e) => {
        const tel = e.target.value;


        if (tel.length === 10) {
            const regex = /^[1-9][0-9]*$/;
            if (!(regex.test(tel))) {
                setisValid(false);
            }
            else setisValid(true);

        }
        else {
            if (tel.length > 0) {
                setisValid(false);
            }
            else setisValid(true);
        }



    }

    const handlesubmit = async (e) => {

        e.preventDefault();


        if ((isValid)) {
            document.getElementById('CreateDeal-btn').setAttribute('disabled', 'true');
            const formdata = new FormData();
            const arr = [];
            if (document.getElementById('type1').checked) arr.push("Barter");
            if (document.getElementById('type2').checked) arr.push("Paid");
            if (document.getElementById('type3').checked) arr.push("Commission");
            if (document.getElementById("type4").checked) arr.push("Job");

            formdata.append("name", document.getElementById('username').value);
            formdata.append("description", document.getElementById('description').value);
            formdata.append("creatorType", document.getElementById('creatorType').value||"Any Creator can Apply");
            formdata.append("followers", document.getElementById('followers').value);
            formdata.append("dealType", arr);
            formdata.append('mobile', document.getElementById('mobile').value);
            formdata.append('socialMedia', document.getElementById('socialMedia').value)



            fetch(e.target.action, {
                method: e.target.method,
                body: new URLSearchParams(formdata),
                credentials: 'include',

            }).then((res) => res.json()).then((res) => {
                if (!res.success) {
                    alert(res.message);

                    document.getElementById('CreateDeal-btn').removeAttribute('disabled');
                }
                else {

                    alert(res.message);
                    window.location.reload();
                }
            })
        }
        else {
            alert(`Mobile Number is Invalid`);
        }
    }



    return (
      <div className="CreateDeal-container">
        <h3>Enter Details</h3>
        <form
          action={`${process.env.REACT_APP_BASE_URL}v1/apis/deals`}
          encType="multipart/form-data"
          method="post"
          onSubmit={(e) => {
            handlesubmit(e);
          }}
        >
          <div className="username1">
            <label htmlFor="username">Company Name</label>
            <input type="text" name="name" id="username" />
          </div>
          <div className="description">
            <label htmlFor="description">Description of the Deal</label>
            <textarea id="description" name="description"></textarea>
          </div>
          <div className="creatorType">
            <label htmlFor="creatorType">
              What type of Creator/Influencer do you need?
            </label>
            <div className="creatorType-input">
              <input
                type="text"
                name="creatorType"
                id="creatorType"
                onMouseLeave={(e) => setVisible(false)}
                onMouseEnter={(e) => setVisible(true)}
                value={input}
                placeholder="Select from the Options"
              ></input>

              {Visible && (
                <Dropdown
                  func={(value) => setVisible(value)}
                  entries={categories}
                  setinput={setInput}
                  category="creatorTypes"
                  close={close}
                  Input={input}
                />
              )}
            </div>
          </div>
          <div className="followers">
            <label htmlFor="folowers">
              Minimum Number of Followers that you want
            </label>
            <input
              type="number"
              id="followers"
              min={0}
              name="followers"
              placeholder="Enter Number "
            ></input>
          </div>
          <div className="dealType">
            <label htmlFor="dealType">
              What type of deal do you want to do?
            </label>
            <div className="dealType-options">
              <div onClick={(e) => setdeal1(!deal1)}>
                <input type="radio" id="type1" checked={deal1} /> <p>Barter</p>
              </div>
              <div onClick={(e) => setdeal2(!deal2)}>
                <input type="radio" id="type2" checked={deal2} />
                <p>Paid</p>
              </div>
              <div onClick={(e) => setdeal3(!deal3)}>
                <input type="radio" id="type3" checked={deal3} />
                <p>Commission</p>
              </div>
              <div onClick={(e) => setdeal4(!deal4)}>
                <input type="radio" id="type4" checked={deal4} />
                <p>Job</p>
              </div>
            </div>
          </div>
          <div className="contact">
            <div className="mobile">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                inputMode="tel"
                name="mobile"
                id="mobile"
                maxLength={10}
                onChange={(e) => handlePhone(e)}
                placeholder="Enter your Mobile number"
              />
            </div>
            <div className="socialMedia">
              <label htmlFor="socialMedia">Social Media URL</label>
              <input
                type="url"
                name="socialMedia"
                id="socialMedia"
                placeholder="Enter Social Media Link"
              />
            </div>
          </div>

          <button type="submit" id="CreateDeal-btn">
            Submit
          </button>
        </form>
        <IoClose className="close" onClick={()=>close()} />
      </div>
    );
}


export default DealCreate;
