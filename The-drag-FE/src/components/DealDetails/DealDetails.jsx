import React from 'react'
import './DealDetails.css'
import Contact from '../Contact/Contact';
import Popup from 'reactjs-popup';

const DealDetails = ({props}) => {
    const {companyName,socialMedia,dealDescription,creatorType,dealType,followers,email,iscreator}=props;

  return (
    <div className="deal_detail-container">
      <table>
        <tbody>
          <td className="head">
            <h3>Company Name</h3>
          </td>

          <td className="des">
            <a href={socialMedia} target="_blank">
              <p>
                {" "}
                {companyName}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                </svg>
              </p>
            </a>
          </td>
        </tbody>
        <tbody>
          <td className="head">
            <h3>Deal Description</h3>
          </td>

          <td className="des">
            <p id="dealdescription"> {dealDescription}</p>
          </td>
        </tbody>

        <tbody>
          <td className="head">
            <h3>Creator Type</h3>
          </td>

          <td className="des">
            <p> {creatorType}</p>
          </td>
        </tbody>
        <tbody>
          <td className="head">
            <h3>Minimum Followers</h3>
          </td>

          <td className="des">
            <p> {followers}</p>
          </td>
        </tbody>
        <tbody>
          <td className="head">
            <h3>Deal Type</h3>
          </td>

          <td className="des">
            <p> {dealType}</p>
          </td>
        </tbody>
      </table>
      <div className="controls">{
        iscreator ==="true" ? (
        <Popup trigger={<button className="apply-button">Apply</button>} modal>
          {(close) => {
            return (
              <Contact
                close={close}
                email={email}
                name={companyName}
              />
            );
          }}
        </Popup>
        ):<></>}
      </div>
    </div>
  );
}

export default DealDetails
