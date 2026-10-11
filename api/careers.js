const nodemailer = require("nodemailer");
const formidable = require("formidable");
const fs = require("fs");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true
    });

    const [fields, files] = await form.parse(req);

    const getValue = (value) =>
      Array.isArray(value) ? value[0] : value || "";

    const fullName = getValue(fields.full_name);
    const phone = getValue(fields.phone);
    const email = getValue(fields.email);
    const country = getValue(fields.country);
    const department = getValue(fields.department);
    const portfolio = getValue(fields.portfolio);

    if (!fullName || !phone || !email || !country) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing."
      });
    }

    const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;

    if (!cvFile) {
      return res.status(400).json({
        success: false,
        message: "CV file is required."
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Weldex Careers" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || "info@weldexsteel.com",
      replyTo: email,
      subject: `[WELDEX CAREERS] New Job Application - ${fullName}`,
      html: `
        <h2>WELDEX CAREERS FORM</h2>
        <p><strong>Source:</strong> Careers Form</p>
        <hr>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Department:</strong> ${department || "-"}</p>
        <p><strong>Portfolio / LinkedIn:</strong> ${portfolio || "-"}</p>
      `,
      attachments: [
        {
          filename: cvFile.originalFilename || "CV",
          content: fs.createReadStream(cvFile.filepath)
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Application sent successfully."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to send application."
    });
  }
};
