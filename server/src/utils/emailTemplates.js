export const welcomeUserTemplate = (name, password, verificationCode) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to Clinicare</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for registering with us. To get started, please verify your account with the code below.</p>
              ${
                password
                  ? `<p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">Your password is ${password}. Please update your password in the settings as soon as possible.</p>`
                  : ""
              }
              <p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">${verificationCode}</p>
              <p>This code will expire in 1 hour.</p> 
              <p>Do not share this code with anyone.</p>    
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

export const resendVerificationTemplate = (name, verificationCode) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Resend Verification Code</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Use the code below to verify your account:</p>
              <p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">${verificationCode}</p>
              <p>This code will expire in 1 hour.</p> 
              <p>Do not share this code with anyone.</p>    
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

export const passwordResetTemplate = (name, email, resetToken) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Reset Password</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Follow the link to reset your password:</p>
              <p style="font-weight: bold; font-size: 20px; color:rgb(21, 66, 119);">${
                process.env.CLIENT_URL
              }/account/reset-password?email=${email}&token=${resetToken}</p>
              <p>Do not share this link with anyone.</p>  
              <p>This link will expire in 15 minutes.</p>  
              <p>If you did not request a password reset, please ignore this email.</p>   
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

export const appointmentStatusTemplate = (name, status) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Appointment Status</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Your appointment status has been updated to ${status}.</p>
              ${
                status === "confirmed"
                  ? `<p>Please log into your account to view your appointment details.</p>`
                  : ""
              }
              ${
                status === "cancelled"
                  ? `<p>Thank you for using our service.</p>`
                  : ""
              }
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

export const createPaymentTemplate = (name, amount) => `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Payment Information</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Your payment for ${amount} has been created successfully. Please log into your account to view your payment details.</p>
              <p>After successfully making payment, kindly upload the receipt to your account. You will receive a confirmation email.</p>
              <p>Thank you for using our service.</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

export const paymentReceiptTemplate = (name, amount, date, receipt) =>
  `
    <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
          img {
              max-width: 300px;
              height: 250px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Payment Information Update</h1>
          </div>
          <div class="content">
              <p>Payment receipt for ${amount} by Patient ${name} on ${date} has been uploaded successfully.</p>
              <p>Kindly visit the portal to confirm the payment.</p>
              <img src="${receipt}" alt="Payment Receipt" />
              <a href="${receipt}">
              <button class="button">View Receipt</button></a>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
   `;

export const paymentStatusTemplate = (name, amount, status) =>
  `
     <!DOCTYPE html>
  <html>
  <head>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color:rgb(41, 48, 171);
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
          }
          .footer { 
              margin-top: 20px;
              font-size: 12px;
              color: #777;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Payment Update</h1>
          </div>
          <div class="content">
              <p>Hello ${name},</p>
              <p>Your payment of ${amount} has been <b>${status}</b>.</p>
              ${
                status === "confirmed"
                  ? `<p>Please log into your account to view your payment details.</p>`
                  : ""
              }
              ${
                status === "cancelled"
                  ? `<p>You will be refunded for the payment. Thank you for using our service.</p>`
                  : ""
              }
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Clinicare - Booking Center Clinic. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
    `;
