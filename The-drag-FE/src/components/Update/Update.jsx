import React,{useState} from 'react'
import "../Register/Register.css";
import categories from '../../assets/categories'
import images from '../../assets/images'
import close_icon from '../../assets/close_icon.svg'
import dotenv from 'dotenv'
import Dropdown from '../Dropdown/Dropdown'
dotenv.config();


var img;
const Update = ({ close }) => {
    const { linkedin, insta, twitter, youtube, facebook } = images;
    const [visible,setvisible]=useState(false);
    const [locations,setlocations]=useState([]);
    const [isValid,setisValid]=useState(true);

    const input=(data)=>{
           
        document.getElementById('location').value=data;
        setvisible(false);
        
            }

    const handleLocation=(e)=>{
            fetch(`https://nominatim.openstreetmap.org/search?q=${e.target.value}&format=json`)
            .then((res)=>res.json())
            .then(res=>{
                
              let arr= res.map((ele)=>{
                return ele.display_name;
               })
               setlocations(arr);
             
               setvisible(true);
            })
    }
    function debounce(handleLocation, delay, e) {
        let timeoutId;
      
          if (timeoutId) {
          
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
           handleLocation(e);
          }, delay);
        
      }
      const handlePhone=(e)=>{
        const tel=e.target.value;
        
        
            if(tel.length===10){
                const regex = /^[1-9][0-9]*$/;
                if(!(regex.test(tel))){
                   setisValid(false);
                } 
                else setisValid(true);
                
             }
             else {
                if(tel.length>0){
                    setisValid(false);
                }
                else setisValid(true);
             }
        

        
      }

      const handlesubmit = async (e) => {

        e.preventDefault();
        if(img!=null){
        if(((img.size<=1024*1024) && isValid)){
            document.getElementById('update-btn').setAttribute('disabled','true');
        const data = {
            type: document.getElementById('type').value,
            userName: document.getElementById('username').value,
            location: document.getElementById('location').value,
            phone: document.getElementById('phone').value,
            profileImage: img,
            insta: document.getElementById('instaurl').value,
            instacount: (document.getElementById('instacount').value),
            twitter: document.getElementById('twitterurl').value,
            twittercount: (document.getElementById('twittercount').value),
            linkedin: document.getElementById('linkedinurl').value,
            linkedincount: (document.getElementById('linkedincount').value),
            facebook: document.getElementById('facebookurl').value,
            facebookcount: (document.getElementById('facebookcount').value),
            youtube: document.getElementById('youtubeurl').value,
            youtubecount: (document.getElementById('youtubecount').value),

        }
        
        const formdata = new FormData();
        for (let key in data) {
            formdata.append(key, data[key]);
        }

        fetch(e.target.action, {
            method: 'post',
            body: formdata,
            credentials: 'include',

        }).then((res) => res.json()).then((res) => {
            if (!res.success) {
                alert(res.error);
                 
                 document.getElementById('update-btn').removeAttribute('disabled');
            }
            else {

                sessionStorage.setItem('creator', true);
                alert(res.message);
                window.location.reload();
            }
        })
    }
    else if(img.size>1024*1024 && !isValid) {
        alert(`Mobile Number is Invalid.
            Image Size Exceeding 1MB`);
    }
    else if(img.size>1024*1024){
        alert(`Image Size Exceeding 1MB`);

    }
    else{
        alert(`Mobile Number is Invalid`);
    }
}
else{
    if(( isValid)){
        document.getElementById('update-btn').setAttribute('disabled','true');
        const data = {
            type: document.getElementById('type').value,
            userName: document.getElementById('username').value,
            location: document.getElementById('location').value,
            phone: document.getElementById('phone').value,
            profileImage: img,
            insta: document.getElementById('instaurl').value,
            instacount: (document.getElementById('instacount').value),
            twitter: document.getElementById('twitterurl').value,
            twittercount: (document.getElementById('twittercount').value),
            linkedin: document.getElementById('linkedinurl').value,
            linkedincount: (document.getElementById('linkedincount').value),
            facebook: document.getElementById('facebookurl').value,
            facebookcount: (document.getElementById('facebookcount').value),
            youtube: document.getElementById('youtubeurl').value,
            youtubecount: (document.getElementById('youtubecount').value),

        }
        const formdata = new FormData();
        for (let key in data) {
            formdata.append(key, data[key]);
        }

        fetch(e.target.action, {
            method: 'post',
            body: formdata,
            credentials: 'include',

        }).then((res) => res.json()).then((res) => {
            if (!res.success) {
                alert(res.error);
                 
                 document.getElementById('update-btn').removeAttribute('disabled');
            }
            else {

                sessionStorage.setItem('creator', true);
                alert(res.message);
                window.location.reload();
            }
        })
    }
    else{
        alert(`Mobile Number is Invalid`);
    }
}
}
    return (
        <div className='register-container'>
            <h3>Edit Creator Details</h3>
            <form action={`${process.env.REACT_APP_BASE_URL}v1/apis/edit`} encType='multipart/form-data' method='post' onSubmit={(e) => {
              
                handlesubmit(e);
                
            }} >
                <div className="username">
                    <label htmlFor="username">User Name</label>
                    <input type="text" name="userName" id="username" />
                </div>
                <div className="Type">
                    <label htmlFor="type">Type</label>
                    <select name="type" id="type" >
                        
                        <option value=" ">No Change</option>
                        {
                            categories.map((ele) => <option value={ele}>{ele}</option>)
                        }
                    </select>
                </div>
                <div className="Location">
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" id="location" placeholder='City,State or Country' onInput={(e)=>{
                    debounce(handleLocation,1500,e);
                    }} />

                   {
                  (visible&&locations.length>0)?<Dropdown entries={locations} input={input} category="location"/>:''
}
                </div>
                <div className="contacts">

                    <div className="Mobile">
                        <label htmlFor="phone">
                            Mobile No.
                        </label>
                        <input type="tel" onInput={(e)=>handlePhone(e)}   maxLength={10} minLength={0} name="phone" id="phone" placeholder='XXXXX-XXXXX' />
                    </div>
                    <div id='profileImage'>
                        <label htmlFor="profileImage">Profile Image</label>
                        <input type="file" accept='image/*' name="profileImage" id="profileImage" onChange={e => { img = e.target.files[0] }} />
                        <p >{"(File size less than 1MB)"}</p>

                    </div>
                    <div className="insta">
                        <div>
                            <label htmlFor="insta"><img src={insta} />Instagram </label>
                            <input type="url" name="insta" id="instaurl" placeholder='Enter URL' />
                        </div>
                        <div>
                            <label htmlFor="insta"><img src={insta} />Followers </label>
                            <input type='number' name="instacount" id="instacount" min={0} />
                        </div>

                    </div>
                    <div className="linkedin">
                        <div>
                            <label htmlFor="linkedinurl"><img src={linkedin} />Linkedin </label>
                            <input type="url" name="linkedin" id="linkedinurl" placeholder='Enter URL' />
                        </div>
                        <div>
                            <label htmlFor="linkedincount"><img src={linkedin} />Followers </label>
                            <input type="number" name="linkedincount" id="linkedincount" min={0} />
                        </div>

                    </div>
                    <div className="twitter">
                        <div>
                            <label htmlFor="twitterurl"><img src={twitter} />Twitter </label>
                            <input type="url" name="twitter" id="twitterurl" placeholder='Enter URL' />
                        </div>
                        <div>
                            <label htmlFor="twittercount"><img src={twitter} />Followers </label>
                            <input type="number" name="twittercount" id="twittercount" min={0} />
                        </div>
                    </div>
                    <div className="facebook">
                        <div>
                            <label htmlFor="facebookurl"><img src={facebook} />Facebook </label>
                            <input type="url" name="facebook" id="facebookurl" placeholder='Enter URL' />
                        </div>
                        <div>
                            <label htmlFor="facebookcount"><img src={facebook} />Followers </label>
                            <input type="number" name="facebookcount" id="facebookcount" min={0} />
                        </div>
                    </div>
                    <div className="youtube">
                        <div>
                            <label htmlFor="youtubeurl"><img src={youtube} />Youtube </label>
                            <input type="url" name="youtube" id="youtubeurl" placeholder='Enter URL' />
                        </div>
                        <div>
                            <label htmlFor="youtubecount"><img src={youtube} />Followers </label>
                            <input type="number" name="youtubecount" id="youtubecount" min={0} />
                        </div>
                    </div>

                </div>



                <button id='update-btn' type="submit">Submit</button>
            </form>
            <img src={close_icon} alt="" width={50} height={50} onClick={close} style={{ cursor: 'pointer' }} />
        </div>
    )
}

export default Update;
