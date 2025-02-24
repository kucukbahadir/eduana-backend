const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailConfig = require('../config/emailConfig');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class UserService {
    // Static method to fetch user details by userId
    static async fetchUserDetails(userId) {
        try {
            // Query the database to find a unique user by id
            const user = await prisma.user.findUnique({
                omit: {password: true}, //Sometimes this is wacky. If you get an error it's because your prisma client is out of date. Then use omitApi instead.
                where: { id: userId }
                });

            // If user is found, return the user object
            if (user) {
                return user;
            } else {
                // If user is not found, throw an error
                throw new Error('User not found');
            }
        } catch (err) {
            // Log the error to the console and rethrow it
            console.error(err);
            throw err;
        }
    }

    async requestPasswordReset(email) {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 300000); // 5 minutes
        const url = 'http://localhost:' + (process.env.PORT || 3000)
        const transporter = nodemailer.createTransport(emailConfig.smtp);
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error('User not found');

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: tokenExpiry
            }
        });

        // message is not final (since it is very barebones)
        const mailOptions = {
            from: emailConfig.sender,
            to: email,
            subject: "Password Reset",
            html: `
                <h1>Password Reset</h1>
                <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <a href="${url}/api/users/update-password/${token}">${url}/api/users/update-password/${token}</a>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error('Error sending email');
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    }

    async changePassword(token, password) {
        if (!password) throw new Error('Password is required'); // incomplete as password requirements are unknown
        if (!token) throw new Error('Token is required');

        const user = await prisma.user.findFirst({ where: { resetToken: token } });

        if (!user) throw new Error('Token not found');
        if (new Date() > user.resetTokenExpiry) throw new Error('Token expired');

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })
    }
    // Function to authenticate user based on userType and credentials
    async authenticateUser(userType, credentials) {
        try {
            userType = userType.toUpperCase();
            let user = null;
            let redirect = null;

            if (userType === "STUDENT") {
                user = await prisma.user.findUnique({
                    where: { username: credentials.name },
                });

                if (user && user.passwordHash) {
                    const passwordMatch = await bcrypt.compare(credentials.code, user.passwordHash);
                    if (passwordMatch && user.role === "STUDENT") {
                        redirect = "/dashboard/student";  // ✅ Store redirect URL
                        return { success: true, user, redirect };
                    }
                }
            } else if (userType === "PARENT") {
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && user.passwordHash) {
                    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                    if (passwordMatch && user.role === "PARENT") {
                        redirect = "/dashboard/parent";
                        return { success: true, user, redirect };
                    }
                }
            } else if (userType === "EDUCATORS") {
                let educatorRole = credentials.role.toUpperCase();
                user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && user.passwordHash) {
                    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
                    if (passwordMatch && user.role === educatorRole) {
                        redirect = `/dashboard/${user.role.toLowerCase()}`;
                        return { success: true, user, redirect };
                    }
                }
            }

            return { success: false, message: "Invalid credentials or role mismatch" };
        } catch (error) {
            console.error("Error during authentication:", error);
            return { success: false, message: "An error occurred during authentication" };
        }
    }
}

module.exports = new UserService();