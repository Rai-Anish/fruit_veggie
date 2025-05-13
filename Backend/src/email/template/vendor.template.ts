export const accountReviewTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Under Review</title>
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
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 140px;
      }
      h2 {
        color: #4f46e5;
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
      <div class="header">
        <img src="https://yourdomain.com/logo.png" alt="YourApp Logo" />
      </div>
      <h2>Hello, ${name || "User"} 👋</h2>
      <p>Thank you for registering as a vendor on <strong>YourApp</strong>.</p>
      <p>Your account is currently <strong>under review</strong>. We’re verifying your information to ensure quality and trust for all users on our platform.</p>
      <p>You’ll receive an email notification once your vendor account is approved. In the meantime, feel free to reach out if you have any questions.</p>
      <p>We appreciate your patience!</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const accountApprovedTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Approved</title>
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
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 140px;
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
      <div class="header">
        <img src="https://yourdomain.com/logo.png" alt="YourApp Logo" />
      </div>
      <h2>Congratulations, ${name || "User"}! 🎉</h2>
      <p>Your vendor account has been <strong>approved</strong> and is now active on <strong>YourApp</strong>.</p>
      <p>You can now access your dashboard, list products, and manage your store.</p>
      <a href="https://yourapp.com/dashboard" class="btn">Go to Dashboard</a>
      <div class="footer">
        &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const accountRejectedTemplate = (name, reason) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Rejected</title>
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
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 140px;
      }
      h2 {
        color: #e53e3e;
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
      <div class="header">
        <img src="https://yourdomain.com/logo.png" alt="YourApp Logo" />
      </div>
      <h2>Hi ${name || "User"},</h2>
      <p>We regret to inform you that your vendor account application has been <strong>rejected</strong>.</p>
      <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
      <p>If you believe this was a mistake or want to appeal the decision, please contact our support team.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

export const approvalReminderTemplate = (name, verificationUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Verification Reminder</title>
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
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 140px;
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
      <div class="header">
        <img src="https://yourdomain.com/logo.png" alt="YourApp Logo" />
      </div>
      <h2>Hi ${name || "User"},</h2>
      <p>We noticed that your vendor account is still pending approval. Before we can approve your account, you must verify your email address.</p>
      <p>To verify your email, simply click the button below:</p>
      <a href="${verificationUrl}" class="btn">Verify Your Email</a>
      <p>If you have already verified your email, please disregard this reminder. If you have any questions, feel free to reach out to our support team.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
