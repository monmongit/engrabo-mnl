const nodemailer = require("nodemailer");
const path = require("path");

const resetMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const attachments = [
      {
        filename: "engrabo-logo.png",
        path: path.join(__dirname, "images", "engrabo-logo.png"),
        cid: "logo",
      },
      {
        filename: "footer.png",
        path: path.join(__dirname, "images", "footer.png"),
        cid: "logo2",
      },
    ];

    const messageText =
      options.subject === "Activate your account"
        ? "We’ve received your request to activate your account. Please click the link below to complete the activation."
        : "We’ve received your request to reset your password. Please click the link below to complete the reset.";

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: `
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
  
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-top: 10px solid #B88E61; border-radius: 4px;">
          <img src="cid:logo" alt="Logo" style="display: block; margin: auto; max-width: 100%; max-height: 100%;" />

          <h2 style="font-weight: bold; margin-bottom: 20px;">${
            options.subject
          }</h2>
          <p style="margin-bottom: 20px;">Hi ${options.name},</p>
          <p style="margin-bottom: 20px;">${messageText}</p>
          <div class="flex justify-center;">
            <a
              href="${options.url}"
              style="display: inline-block; padding: 10px 20px; margin-top: 10px; margin-bottom: 70px; font-size: 14px; font-weight: bold; color: #ffffff; background-color: #B88E61; border: none; border-radius: 4px; text-decoration: none; text-align: center;"
            >
              ${
                options.subject === "Activate your account"
                  ? "Activate Account"
                  : "Reset Password"
              }
            </a>
          </div>
        </div>
        
        <img src="cid:logo2" alt="Footer" style="position: absolute; bottom: 0; right: 0; left: 0; margin: 0; max-width: 100%; height: auto; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; margin-top: -2px;" />

      </div>
      `,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = resetMail;
