const nodemailer = require("nodemailer");
const path = require("path");
const moment = require("moment");
const receiptMail = async (latestOrder) => {
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
        // filename: "footer.png",
        path: path.join(__dirname, "images", "footer.png"),
        cid: "footer",
      },
    ];

    const createAt = latestOrder?.createAt;
    const formattedCreateAt = createAt
      ? moment(createAt).format("YYYY-MM-DD HH:mm")
      : "";

    const orderItemsHTML =
      latestOrder &&
      latestOrder.cart
        .map(
          (item, index) =>
            `<tr key=${index}>
            <td style="padding: 10px;">
                <img src="${item.images[0]?.url}" alt="" style="width: 100px; height: 100px; border-radius: 5px;"  />
            </td>
            <td style="padding: 10px; font-size: 12px; font-weight: bold;">${item.description}</td>
            <td style="padding: 10px; font-size: 12px; font-weight: bold;">₱${item.originalPrice}</td>
            <td style="padding: 10px; font-size: 12px; font-weight: bold;">x${item.qty}</td>
            <td style="padding: 10px; font-size: 12px; font-weight: bold;">₱${item.subTotal}</td>
        </tr>`
        )
        .join("") +
        `<tr>
          <td colspan="5"><hr style="border: 1px solid #dddddd;"></td>
        </tr>
        <tr>
          <td style="padding: 10px;" colspan="1"></td>  <!-- Empty cell to align Total Payment under the second column -->
          <td style="padding: 10px; font-weight: bold; margin-bottom: 20px;" colspan="2">Total Payment:</td>
          <td style="padding: 10px; font-weight: bold;" colspan="1"></td>  <!-- Empty cell to align Total Payment under the second column -->
          <td style="padding: 10px; font-weight: bold;">₱${latestOrder.totalPrice}</td>
        </tr>`;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: latestOrder?.user?.email,
      subject: "Engrabo MNL's Order Confirmation",
      html: `
      <div style="width: 100%; max-width: 700px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-top: 10px solid #B88E61; border-radius: 4px;">
          <img src="cid:logo" alt="Logo" style="display: block; margin: auto; max-width: 100%; max-height: 100%;" />
  
          <h1 style="font-weight: bold; margin-bottom: 20px; text-align: center;">Thanks for shopping with us!</h1>
      <hr style="margin-bottom: 40px;">
      <p style="margin-bottom: 30px; font-size: 18px; text-align: center;">
      Hi <span style="color: #B88E61; font-size: 18px;">${latestOrder?.user?.name}</span>,
      </p>
          <p style="margin-bottom: 10px; font-size: 15px; font-weight: bold;  text-align: center;">Your order [${latestOrder?._id}] has been submitted and is now processing.</p>
          <p style="margin-bottom: 40px; font-size: 15px; font-weight: bold;  text-align: center;">Please see your order summary and details below.</p>
          <!-- Table starts here -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #dddddd;">
        <thead>
        <tr>
            <th colspan="2" style="text-align: left; background-color: #F5F5F5; padding: 20px; font-size: 15px;">Order Information</th>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Order #</td>
              <td style="padding: 10px; font-size: 12px; font-weight: bold;">${latestOrder?._id}</td>
          </tr>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Payment Method</td>
              <td style="padding: 10px; font-size: 12px; font-weight: bold;">${latestOrder?.paymentInfo?.type}
              </td>
          </tr>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Date Ordered</td>
              <td style="padding: 10px; font-size: 12px; font-weight: bold;">${formattedCreateAt}</td>
          </tr>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Claim Type</td>
              <td style="padding: 10px; font-size: 12px; font-weight: bold;">Delivery</td>
          </tr>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Shipping Address</td>
              <td style="padding: 10px; font-size: 12px; font-weight: bold;">${latestOrder?.shippingAddress?.address1}, ${latestOrder?.shippingAddress?.city}
              </td>
          </tr>
          <tr>
              <td style="width: 40%; padding: 10px; font-size: 12px; font-weight: bold;">Contact</td>
              <td style="padding: 10px; font-size: 12px; font-size: 12px; font-weight: bold;">${latestOrder?.user?.phoneNumber}</td>
          </tr>
      </tbody>
    </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #dddddd;">
        <thead>
            <tr>
                <th colspan="5" style="text-align: left; background-color: #F5F5F5; padding: 20px; font-size: 15px;">Order Details</th>
            </tr>
            <tr>
            <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Product</th>
            <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Product Details</th>
            <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Price</th>
            <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Quantity</th>
            <th style="padding: 10px; font-size: 12px; font-weight: bold; text-align: left;">Total</th>
            </tr>
        </thead>
        <tbody>
        ${orderItemsHTML}


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

module.exports = receiptMail;
