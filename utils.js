const transliteration = require("transliteration");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { Resend } = require('resend');
const resend = new Resend('re_VdLtkKic_Em4HmnfzzoeLE3wrQboNruzQ');
dotenv.config();


function generateEmailCombinations(firstName, lastName) {
  const emailCombinations = [];

  // Generate combinations with no company name
  // emailCombinations.push(`${firstName}.${lastName}@intercom.io`);
  emailCombinations.push(`${firstName}_${lastName}@intercom.io`);
  emailCombinations.push(`${firstName}${lastName}@intercom.io`);
  emailCombinations.push(`${firstName}1@intercom.io`);
  emailCombinations.push(`${lastName}1@intercom.io`);
  // emailCombinations.push(`${firstName}@intercom.io`);
  emailCombinations.push(`${lastName}@intercom.io`);
  emailCombinations.push(`${lastName}${firstName}@intercom.io`);
  emailCombinations.push(`${lastName}.${firstName}23@intercom.io`);
  emailCombinations.push(`${lastName}_${firstName}@intercom.io`);
  emailCombinations.push(`${lastName}1${firstName}@intercom.io`);

  return emailCombinations;
}

function splitFullName(fullName) {
  const nameParts = fullName.trim().split(" ");
  const first_name = nameParts[0];
  const last_name = nameParts.slice(1).join(" "); // Join remaining parts for multi-word last names

  return {
    first_name,
    last_name,
  };
}

function generateEmails(firstName, lastName, numberOfEmails) {
  const emails = [];
  const emailProviders = ["intercom.io"];

  // Generate emails using different combinations of first and last names
  for (let i = 1; i <= numberOfEmails; i++) {
    const randomNumber = Math.floor(Math.random() * 1000); // Add a random number to avoid duplicates
    const randomProviderIndex = Math.floor(
      Math.random() * emailProviders.length
    );
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber}@${
      emailProviders[randomProviderIndex]
    }`;
    emails.push(email);
  }

  return emails;
}

function convertToEnglishAlphabet(name) {
  // Use transliteration library to convert the name to Latin characters (English alphabet)
  const englishName = transliteration.transliterate(name, { unknown: "_" });

  // Remove any underscores (_) used for characters that couldn't be transliterated
  const cleanedEnglishName = englishName.replace(/_/g, "");

  return cleanedEnglishName;
}

function sendMail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: `${email}`,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    console.log(error, info)
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to ${email} : ${info.response}`);
    }
  });
}



async function resendApi (email) {
  try {
    const data = await resend.emails.send({
      // from: process.env.SMTP_USERNAME,
     from:  'officialdammires123@zajap.xyz',
      to: email,
      // to: 'officialdammires123@gmail.com',
      subject: 'Hello World',
      html: '<strong>It works!</strong>',
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};


module.exports = {
  generateEmails,
  splitFullName,
  sendMail,
  generateEmailCombinations,
  convertToEnglishAlphabet,
  resendApi
};
