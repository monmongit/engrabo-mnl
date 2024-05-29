const nodemailer = require("nodemailer");
const path = require("path");
const stockAlert = async (options) => {
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
        cid: "footer",
      },
      {
        filename: "LimitedStock.png",
        path: path.join(__dirname, "images", "LimitedStock.png"),
        cid: "limited",
      },
    ];

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: `
      <div style="width: 100%; max-width: 700px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-top: 10px solid #B88E61; border-radius: 4px;">
        <img src="cid:logo" alt="Logo" style="display: block; margin: auto; max-width: 100%; max-height: 100%;" />
        <hr style="margin-bottom: 40px;" />
        <img src="cid:limited" alt="limited" style="display: block; margin: auto; width: 300px; height: 100%; margin-bottom: 40px" />
    
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #dddddd;">
          <thead>
            <tr>
              <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Product Image</th>
              <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Stock Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px;">
                <img src="${options.image}" alt="Product Image" style="width: 200px; height: 200px; border-radius: 5px; margin-bottom: 40px" />
              </td>
              <td style="padding: 10px;">
                <p style="font-size: 15px; font-weight: bold;">
                  The stock for the product [${options.id}] is critically low. Current stock: 
                  <span style="color: red;">${options.stock}</span>.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <img src="cid:footer" alt="Footer" style="position: absolute; bottom: 0; right: 0; left: 0; margin: 0; max-width: 100%; height: auto; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; margin-top: -2px;" />
    </div>
        `,
      attachments: attachments, // Add the attachments to the mailOptions object
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = stockAlert;
