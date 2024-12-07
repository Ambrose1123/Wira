import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

async function sendTestEmail() {
  const params = {
    Source: process.env.SENDER_EMAIL,
    Destination: { ToAddresses: ["example@gmail.com"] }, //your email address
    Message: {
      Subject: { Data: "Test Email from Amazon SES" },
      Body: { Text: { Data: "This is a test email sent from Amazon SES." } },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

sendTestEmail();
