// emailVerificationTemplate.js
export const emailVerificationTemplate = (name, verificationUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f8fc;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #fff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .btn {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        color: #fff;
        background-color: #4f46e5;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Hello ${name || "there"},</h2>
      <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" class="btn">Verify Email</a>
      <p> ${verificationUrl}</p>
      <p style="margin-top: 16px;">⏰ <strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
      <p>If you didn't create this account, you can ignore this email.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

// passwordResetOtpTemplate.js

export const passwordResetOtpTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f8fc;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .code {
          font-size: 32px;
          letter-spacing: 4px;
          font-weight: bold;
          background: #f3f4f6;
          padding: 15px 20px;
          text-align: center;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${name || "there"},</h2>
        <p>We received a request to reset your password. Use the following code to continue:</p>
        <div class="code">${otp}</div>
        <p>This code will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
};

// welcomeTemplate.js

export const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to YourApp</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f8fc;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        h2 {
          color: #4f46e5;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          margin-top: 20px;
          color: #fff;
          background-color: #4f46e5;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome, ${name || "User"}!</h2>
        <p>Your email has been successfully verified. You’re now ready to enjoy all the amazing features of YourApp!</p>
        <a href="https://yourapp.com/dashboard" class="btn">Go to Dashboard</a>
        <p>If you have any questions or need help, feel free to reach out to our support team.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
};
