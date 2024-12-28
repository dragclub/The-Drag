export const resetPasswordEmail = (resetUrl) => {
  return `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>Reset Your Password</title>
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
      
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  font-weight: bold;
                  color: #ffffff;
                  background-color: #4CAF50;
                  text-decoration: none;
                  border-radius: 5px;
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
              <div class="message">Reset Your Password</div>
              <div class="body">
                  <p>We received a request to reset your password. Click the button below to proceed:</p>
                  <a class="button" href="${resetUrl}">Reset Password</a>
                  <p>If you did not request a password reset, you can safely ignore this email. The link will expire in <span class='highlight'>10 minutes</span>.</p>
              </div>
              <div class="support">If you need assistance, please contact us at <a
                      href="mailto:info@thedrag.in">info@thedrag.in</a>.</div>
          </div>
      </body>
      
      </html>`;
};
