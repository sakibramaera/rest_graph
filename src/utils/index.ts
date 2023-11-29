import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const jwtSecret = "your-secret-key";
// Function to send OTP via email
export async function sendOTPByEmail(
  email: string,
  otp: string
): Promise<void> {
  try {
    // Create a transporter with your email service provider's SMTP details
    const transporter = nodemailer.createTransport({
      service: "cpnsingh8181@gmail.com", // e.g., 'gmail'
      auth: {
        user: "cpnsingh8181@gmail.com", // your email
        pass: "dggiqhlfyflvfkkb", // your email password
      },
    });

    // Define email content
    const mailOptions = {
      from: "cpnsingh8181@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}
// Function to generate OTP

export function generateOTP(): string {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}
// password checking
export function comparePassword(
  password: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
//   generate token for login
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1h" });
}
