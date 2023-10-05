//phần code này được tham khảo trên trang
//https://trungquandev.com/nodejs-viet-api-gui-email-voi-oauth2-va-nodemailer/
//và đã sửa chữa lại cho phù hợp theo yêu cầu đề bài
const nodeMailer = require("nodemailer");
const Auth2 = require("google-auth-library").OAuth2Client;

const ADMIN_EMAIL_ADDRESS = "trggphong@gmail.com";
const GOOGLE_MAILER_CLIENT_ID =
  "550805995698-prmn1o3p7c988qjhioa4d3uh9kfhlqhj.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04DAuJtzu4EjrCgYIARAAGAQSNwF-L9IrKGlhyY23DHh6gJ7SkMex0WAWKQp3a6aiUJwbOEfHRBWLodDU5qIRLlvjG507mZYmkrY";

const sendMail = async (to, subject, htmlContent) => {
  try {
    const myOAuth2Client = new Auth2(
      GOOGLE_MAILER_CLIENT_ID,
      GOOGLE_MAILER_CLIENT_SECRET
    );
    myOAuth2Client.setCredentials({
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    const options = {
      to: to, // địa chỉ gửi đến
      subject: subject, // Tiêu đề của mail
      html: htmlContent, // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    };

    return transporter.sendMail(options);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
