import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../Register/cropImage";
import "../Register/CreatorRegistration.css";
import upload from "../../assets/upload.svg";
import Popup from "reactjs-popup";

import { IoClose } from "react-icons/io5";
import categories from "../../assets/categories";

const UpdateCreator = ({ close }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(true);
  const fileInputRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setIsPopupOpen(true);
    }
  };
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImage);
    setIsPopupOpen(false);
  };

  const handlePhone = (e) => {
    const tel = e.target.value;
    setPhone(tel);
    if (tel.length === 10) {
      const regex = /^[1-9][0-9]*$/;
      setIsValid(regex.test(tel));
    } else {
      setIsValid(tel.length === 0);
    }
  };
  // Utility function to convert blob URL to File
  async function urlToFile(url, filename, mimeType) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (croppedImage) {
      if (isValid) {
        document
          .getElementById("register-btn")
          .setAttribute("disabled", "true");

        const data = {
          type: document.getElementById("type").value,
          userName: document.getElementById("username").value,
          location: document.getElementById("location").value,
          phone: phone,
          insta: document.getElementById("instaurl").value,
          instacount: document.getElementById("instacount").value,
          twitter: document.getElementById("twitterurl").value,
          twittercount: document.getElementById("twittercount").value,
          linkedin: document.getElementById("linkedinurl").value,
          linkedincount: document.getElementById("linkedincount").value,
          facebook: document.getElementById("facebookurl").value,
          facebookcount: document.getElementById("facebookcount").value,
          youtube: document.getElementById("youtubeurl").value,
          youtubecount: document.getElementById("youtubecount").value,
        };

        const formData = new FormData();

        for (let key in data) {
          formData.append(key, data[key]);
        }

        try {
          const profileImageFile = await urlToFile(
            croppedImage,
            "profile-image.jpg",
            "image/jpeg"
          );
          formData.append("profileImage", profileImageFile);

          fetch(e.target.action, {
            method: "post",
            body: formData,
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => {
              document
                .getElementById("register-btn")
                .removeAttribute("disabled");
              if (!res.success) {
                alert(res.error);
                 document
                   .getElementById("update-btn")
                   .removeAttribute("disabled");
              } else {
                               sessionStorage.setItem("creator", true);
                               alert(res.message);
                // window.location.reload();
                close();
              }
            });
        } catch (error) {
          console.error("Error converting blob URL to file:", error);
          alert("Failed to upload image.");
        }
      } else {
        alert(`Mobile Number is Invalid or Image Size Exceeds 1MB`);
      }
    } else {
      if (isValid) {
        alert("Please upload an image.");
      } else {
        alert("Mobile Number is Invalid");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Creator Details</h2>
      <form
        action={`${process.env.REACT_APP_BASE_URL}v1/apis/edit`}
        encType="multipart/form-data"
        method="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="reg-form"
      >
        <div className="top-form">
          <div className="top-left-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select id="type" >
                {categories.map((ele) => (
                  <option value={ele}>{ele}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" id="location" placeholder="Enter location" />
            </div>
          </div>

          <div className="profile-picture-section">
            <input
              type="file"
              onChange={handleImageUpload}
              ref={fileInputRef}
              
              style={{ display: "none" }}
            />

            <label>Profile Picture</label>

            <div>
              <img
                src={croppedImage || upload}
                alt="upload_image"
                className="preview"
                onClick={openFilePicker}
              />

              <Popup
                open={isPopupOpen}
                modal
                closeOnDocumentClick={false}
                onClose={() => setIsPopupOpen(false)}
              >
                <div className="crop-container">
                  {image ? (
                    <>
                      <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={130 / 80}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropComplete}
                      />
                      <button type="button" onClick={handleCropConfirm}>
                        Crop & Save
                      </button>
                    </>
                  ) : (
                    <p>Please select an image to crop.</p>
                  )}
                </div>
              </Popup>
            </div>
          </div>
        </div>
        <div className="bottom-form">
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhone}
              placeholder="Phone"
              
            />
            {!isValid && <span className="error">Invalid phone number</span>}
          </div>
          <div className="form-group">
            <label>Instagrma</label>
            <div>
              <input type="url" id="instaurl" placeholder="Link" />
              <input
                type="text"
                id="instacount"
                placeholder="Number of Followers"
              />
            </div>
          </div>
          <div className="form-group">
            <label>youtube</label>
            <div>
              <input type="url" id="youtubeurl" placeholder="Link" />
              <input
                type="text"
                id="youtubecount"
                placeholder="Number of Followers"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Facebook</label>
            <div>
              <input type="url" id="facebookurl" placeholder="Link" />
              <input
                type="text"
                id="facebookcount"
                placeholder="Number of Followers"
              />
            </div>
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <div>
              <input type="url" id="linkedinurl" placeholder="Link" />
              <input
                type="text"
                id="linkedincount"
                placeholder="Number of Followers"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Twitter</label>
            <div>
              <input type="url" id="twitterurl" placeholder="Link" />
              <input
                type="text"
                id="twittercount"
                placeholder="Number of Followers"
              />
            </div>
          </div>
        </div>

        <button id="register-btn" className="submit-button" type="submit">
          Done
        </button>
      </form>

      <IoClose className="close" onClick={close} />
    </div>
  );
};

export default UpdateCreator;
