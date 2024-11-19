export const otpEmail = ( otp) => {
  return `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>OTP Verification</title>
          <style>
              body {
                  background-color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
              }
      
              .logo {
                  max-width: 200px;
                  margin-bottom: 20px;
              }
      
              .message {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
      
              .body {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
      
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #4CAF50;
                  margin: 20px 0;
              }
      
              .support {
                  font-size: 14px;
                  color: #999999;
                  margin-top: 20px;
              }
      
              .highlight {
                  font-weight: bold;
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <a href="https://thedrag.in/"><img class="logo" src="https://res.cloudinary.com/dxcz0rwxz/image/upload/v1731667280/drag/dflj8ye9mcmfvzl4zz1c.png"
                      alt="DRAG.CLUB"></a>
              <div class="message">OTP Verification</div>
              <div class="body">
            
                  <p>Your One-Time Password (OTP) for verification is:</p>
                  <div class="otp">${otp}</div>
                  <p>This OTP is valid for <span class='highlight'>5 minutes</span>. Please do not share it with anyone.</p>
              </div>
              <div class="support">If you did not request this OTP or need assistance, please contact us at <a
                      href="mailto:info@thedrag.in">info@thedrag.in</a>.</div>
          </div>
      </body>
      
      </html>`;
};
