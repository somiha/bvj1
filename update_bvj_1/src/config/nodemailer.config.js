const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require("googleapis");
const { trackStateCounter } = require("../controllers/track/track.controller");
const { readData } = require("../helper/PromiseModule");
const OAuth2 = google.auth.OAuth2;
const { OAuth2Client } = require("google-auth-library");

/**
 * @configObj is a object that contains primary authentication information
 * @google_client_id is the client id of the google app
 * @google_client_secret is the client secret of the google app
 * @google_refresh_token is the refresh token of the google app
 */
// const configObj = {
//   google_client_id: process.env.CLIENT_ID,
//   google_client_secret: process.env.CLIENT_SECRET,
//   google_refresh_token: process.env.REFRESH_TOKEN,
// };

// const OAuth2Client = new OAuth2(
//   configObj.google_client_id,
//   configObj.google_client_secret,
//   configObj.google_refresh_token
// );

// OAuth2Client.setCredentials({ refresh_token: configObj.google_refresh_token });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SENDER_MAIL = process.env.SENDER_MAIL;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function send_welcome_mail(name, recipient) {
  const accessToken = oauth2Client.getAccessToken();
  const mailOptions = {
    from: `Bangladesh Veterinary Journal <${process.env.SENDER_MAIL}>`,
    to: recipient,
    subject: "Welcome to Bangladesh Veterinary Journal",
    html: `Dear ${name} <br />
		Your registration as author has been successfully done. <br />
		We are committed to providing a platform for sharing knowledge, research, and ideas related to animal health, welfare, and management in Bangladesh. Your membership will help us build a stronger community and enable us to promote the veterinary profession in our country. <br />
		Thank you for joining us and being a part of the BVJ community! We look forward to your active participation and contributions. <br />
		<br />
		Best regards,<br />
		BVJ Team`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //   type: "OAuth2",
      user: process.env.SENDER_MAIL,
      //   clientId: process.env.CLIENT_ID,
      //   clientSecret: process.env.CLIENT_SECRET,
      //   refreshToken: process.env.REFRESH_TOKEN,
      //   accessToken: accessToken,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    }
    transporter.close();
  });
}

// this will send a mail with a code of recovery token to the requested email
function send_recovery_mail(name, token, recipient) {
  const accessToken = oauth2Client.getAccessToken();
  const mailOptions = {
    from: `Bangladesh Veterinary Journal <${process.env.SENDER_MAIL}>`,
    to: recipient,
    subject: "Recover Your Password - Bangladesh Veterinary Journal",
    html: `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<style>
				* {
					font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
				}
				.notification.success {
					background-color: #d4edda;
					color: #155724;
				}
				.notification.info{
					background-color: #d1ecf1;
					color: #0c5460;
				}
			</style>
		</head>
		<body>
			<table style="background-color: #0165BD;
										padding: 4px 10px;
										text-align: center;
										display: flex;
										align-items: center;
										justify-content: start;" 
				cellspacing="10px"
			>
				<tr>
					<td colspan="1">
						<img src="https://i.ibb.co/3fTcqZd/logo.png" alt="" class="" id="logo-image" width="50px" />
					</td>
					<td style="text-align: left; margin-left: 10px;" colspan="3">
						<a style="text-decoration: none;" href="/" id="title"><span style="font-size: 18px; font-weight: bold; color: white;">Bangladesh Veterinary Journal</span></a>
					</td>
				</tr>
			</table>
			<div style="background-color: #007bff; text-align: center; padding: 3px 0px;">
				<i style="color: white; font-size: 12px; text-decoration: none; text-align: center;">
					An Official Journal of Bangladesh Veterinary Association
				</i>
			</div>
		
			<div style="margin: 10px;">
				<span style="font-size: 16px; font-weight: bold;">Hello ${name},</span>
			</div>
		
			<div style="padding: 10px;
				margin: 10px;
				border-radius: 5px;
				background-color: #d1ecf1;
				color: #0c5460;" 
			>
				<span>You have requested to reset your password.</span>
			</div>
		
			<div>
				<div style="margin: 10px;">
					Please <a href="${process.env.BASE_URL}/login/reset-password?token=${token}&mail=${recipient}">click here</a> to reset your password.
				</div>
				<div style="margin: 2px 10px; color: rgb(245, 123, 70);">
					<strong>NB: </strong> If you don't recognize this action, please ignore this email.
				</div>
		
				<div style="margin: 10px; color: #6a6a6a;">
					<div>Regards,</div>
					<div>Bangladesh Veterinary Journal (BVJ)</div>
					<div>Mymensingh, Bangladesh</div>
				</div>
			</div>
		</body>
		</html>`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //   type: "OAuth2",
      user: process.env.SENDER_MAIL,
      //   clientId: process.env.CLIENT_ID,
      //   clientSecret: process.env.CLIENT_SECRET,
      //   refreshToken: process.env.REFRESH_TOKEN,
      //   accessToken: accessToken,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      //   console.log("Email not sent!" + err);
      console.error(err);
    }
    transporter.close();
  });
}

// this will send a mail with a code of recovery token to the requested email
async function reviewer_mail(name, reviewer_id, recipient) {
  const select_query = `SELECT reviewers.total_review as total_review, COUNT(paper_reviewer.reviewer_id) as request_for_review FROM reviewers INNER JOIN paper_reviewer ON paper_reviewer.reviewer_id = reviewers.id WHERE reviewers.id = ${reviewer_id}`;
  const counts = await readData(select_query);

  const accessToken = await oauth2Client.getAccessToken();

  const mailOptions = {
    from: `Bangladesh Veterinary Journal <${process.env.SENDER_MAIL}>`,
    to: recipient,
    subject: "Paper Review Request - Bangladesh Veterinary Journal",
    html: `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<style>
				* {
					font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
				}
				.notification.success {
					background-color: #d4edda;
					color: #155724;
				}
				.notification.info{
					background-color: #d1ecf1;
					color: #0c5460;
				}
			</style>
		</head>
		<body>
			<table style="background-color: #0165BD;
										padding: 4px 10px;
										text-align: center;
										display: flex;
										align-items: center;
										justify-content: start;" 
				cellspacing="10px"
			>
				<tr>
					<td colspan="1">
						<img src="https://i.ibb.co/3fTcqZd/logo.png" alt="" class="" id="logo-image" width="50px" />
					</td>
					<td style="text-align: left; margin-left: 10px;" colspan="3">
						<a style="text-decoration: none;" href="/" id="title"><span style="font-size: 18px; font-weight: bold; color: white;">Bangladesh Veterinary Journal</span></a>
					</td>
				</tr>
			</table>
			<div style="background-color: #007bff; text-align: center; padding: 3px 0px;">
				<i style="color: white; font-size: 12px; text-decoration: none; text-align: center;">
					An Official Journal of Bangladesh Veterinary Association
				</i>
			</div>

			<div style="margin: 10px;">
				<span style="font-size: 16px; font-weight: bold;">Hello ${name},</span>
			</div>
		
			<div style="padding: 10px;
				margin: 10px;
				border-radius: 5px;
				background-color: #d1ecf1;
				color: #0c5460;" 
			>
				<span>You have a new request to review a paper.</span>
			</div>
		
			<div>
				<div style="font-size: 16px;
										font-weight: bold;
										margin: 20px 0 10px 10px;"
				>
					Reviewer Profile
				</div>
				<ul type="circle">
					<li>
						<a href="${process.env.BASE_URL}/reviewer_panel/request_for_review" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>
							Request for Review (${counts[0].request_for_review})
						</a>
					</li>
					<li>
						<a href="${process.env.BASE_URL}/reviewer_panel/completed_paper" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Reviewed Papers (${counts[0].total_review})</a>
					</li>
				</ul>
		
				<div style="margin: 2px 10px; color: rgb(245, 123, 70);">
					<strong>NB: </strong> If you don't find any paper on the list, it may be because another reviewer has already reviewed the paper.
				</div>
		
				<div style="margin: 10px; color: #6a6a6a;">
					<div>Editor</div>
					<div>Bangladesh Veterinary Journal (BVJ)</div>
					<div>Mymensingh, Bangladesh</div>
				</div>
			</div>
		</body>
		</html>`,
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //   type: "OAuth2",
      user: process.env.SENDER_MAIL,
      //   clientId: process.env.CLIENT_ID,
      //   clientSecret: process.env.CLIENT_SECRET,
      //   refreshToken: process.env.REFRESH_TOKEN,
      //   accessToken: accessToken,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      //   console.log("Email not sent!" + err);
      console.error(err);
    }
    transporter.close();
  });
}

function reviewer_welcome_mail(name, recipient, password) {
  const accessToken = oauth2Client.getAccessToken();
  const mailOptions = {
    from: `Bangladesh Veterinary Journal <${process.env.SENDER_MAIL}>`,
    to: recipient,
    subject: "Welcome to Bangladesh Veterinary Journal",
    html: `Dear ${name} <br />
		Your registration as Reviewer has been successfully done. <br />
		<h3>Your credentials</h3>
		<p>Email: ${recipient}</p>
		<p>Password: ${password}</p>
		Please click on the link to login to your account <br />
		<div style="display:flex; width: 100%; justify-content: center; align-items: center">
			<a style="background-color: #1449bb; padding: 10px; margin: 10px; color: #e1e1e1; border-radius: 5px; text-decoration: none" href="${process.env.BASE_URL}/reviewer_panel/login">Go to link</a>
		</div>
		<br />
		Best regards,<br />
		BVJ Team`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //   type: "OAuth2",
      user: process.env.SENDER_MAIL,
      //   clientId: process.env.CLIENT_ID,
      //   clientSecret: process.env.CLIENT_SECRET,
      //   refreshToken: process.env.REFRESH_TOKEN,
      //   accessToken: accessToken,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    }
    transporter.close();
  });
}

async function author_paper_update(paper_id, isError, notification) {
  const select_query = `SELECT users.email as email, users.id as id FROM paper_info INNER JOIN users ON paper_info.user_id = users.id WHERE paper_info.id = ${paper_id}`;
  const userInfo = await readData(select_query);
  const recipient = userInfo[0].email;
  const counts = await trackStateCounter(userInfo[0].id);
  const accessToken = oauth2Client.getAccessToken();
  const mailOptions = {
    from: `Bangladesh Veterinary Journal <${process.env.SENDER_MAIL}>`,
    to: recipient,
    subject: notification + " - Bangladesh Veterinary Journal",
    html: `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<style>
				* {
					font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
				}
			</style>
		</head>
		<body>
			<table style="background-color: #0165BD;
										padding: 4px 10px;
										text-align: center;
										display: flex;
										align-items: center;
										justify-content: start;" 
				cellspacing="10px"
			>
				<tr>
					<td colspan="1">
						<img src="https://i.ibb.co/3fTcqZd/logo.png" alt="" class="" id="logo-image" width="50px" />
					</td>
					<td style="text-align: left; margin-left: 10px;" colspan="3">
						<a style="text-decoration: none;" href="/" id="title"><span style="font-size: 18px; font-weight: bold; color: white;">Bangladesh Veterinary Journal</span></a>
					</td>
				</tr>
			</table>
			<div style="background-color: #007bff; text-align: center; padding: 3px 0px;">
				<i style="color: white; font-size: 12px; text-decoration: none; text-align: center;">
					An Official Journal of Bangladesh Veterinary Association
				</i>
			</div>
		
			<div style="padding: 10px;
				margin: 10px;
				border-radius: 5px;

				${
          isError
            ? "background-color: #f8d7da; color: #721c24;"
            : "background-color: #d4edda; color: #155724;"
        }" 
			>
				<span>${notification}.</span>
			</div>
		
			<div>
				<div style="font-size: 16px;
										font-weight: bold;
										margin: 20px 0 10px 10px;"
				>
					New Submision
				</div>
				<ul type="circle">
					<li>
						<a href="${process.env.BASE_URL}/submit" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>
							Submnit New Manuscript
						</a>
					</li>
					<li>
						<a href="${process.env.BASE_URL}/track/submitted_papers" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Submitted Papers (${counts[0]})</a>
					</li>
					<li>
						<a href="${
              process.env.BASE_URL
            }/track/submission_being_processed" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Submission Being Processed (${counts[1]})</a>
					</li>
				</ul>
		
				<div style="font-size: 16px;
										font-weight: bold;
										margin: 20px 0 10px 10px;"
				>Revision</div>
				<ul type="circle">
					<li>
						<a href="${process.env.BASE_URL}/track/need_revision" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Submission Needing Revision (${counts[2]})</a>
					</li>
					<li>
						<a href="${
              process.env.BASE_URL
            }/track/revision_in_process"style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Revision being Processed (${counts[3]})</a>
					</li>
					<li>
						<a href="${process.env.BASE_URL}/track/rejected_paper"style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Declined Revision (${counts[4]})</a>
					</li>
				</ul>
		
				<div style="font-size: 16px;
										font-weight: bold;
										margin: 20px 0 10px 10px;"
				>Completed</div>
				<ul type="circle">
					<li>
						<a href="${process.env.BASE_URL}/track/completed_paper" style="font-size: 16px;
							color: #007bff !important;
							text-decoration: none;"
						>Submission with a Decission (${counts[5]})</a>
					</li>
				</ul>
			</div>
		</body>
		</html>`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //   type: "OAuth2",
      user: process.env.SENDER_MAIL,
      //   clientId: process.env.CLIENT_ID,
      //   clientSecret: process.env.CLIENT_SECRET,
      //   refreshToken: process.env.REFRESH_TOKEN,
      //   accessToken: accessToken,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    }
    transporter.close();
  });
}

module.exports = {
  send_recovery_mail,
  send_welcome_mail,
  reviewer_mail,
  reviewer_welcome_mail,
  author_paper_update,
};
