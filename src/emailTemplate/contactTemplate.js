export const contactEmailTemplate=(subject, body)=> {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
          color: #333333;
        }
        .content {
          padding: 20px;
          color: #555555;
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 10px;
        }
        .footer {
          text-align: center;
          padding: 10px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div class="content">
          <p>${body}</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing Drag!</p>
          <p>&copy; ${new Date().getFullYear()} Drag, Inc.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
