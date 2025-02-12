const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

router.post('/reset-password/', async (req, res) => {
    try {
        const { email } = req.body;
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 300000); // 5 minutes

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                resetToken: token,
                resetTokenExpiry: tokenExpiry
            }
        })
        
        // uses ethereal email for testing purposes
        // for more information refer to: https://www.nodemailer.com/smtp/testing/
        // in short - create an account at ethereal.email and use the credentials provided by replacing the sender object
        const sender = {
            name: 'Donny Schulist',
            address: 'donny.schulist69@ethereal.email',
            password: 'hKD9cbjwTwfF6swsjK'
        };
        const url = 'http://localhost:3000';

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: sender.address,
                pass: sender.password
            }
        });

        // message is not final
        const mailOptions = {
            from: {
                name: sender.name,
                address: sender.address
            },
            to: user.email,
            subject: "Password Reset",
            html: `
                <h1>Password Reset</h1>
                <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <a href="${url}/api/users/update-password/${token}">${url}/api/users/update-password/${token}</a>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({ message: `Password reset confirmation sent to: ${user.email}` });
    } catch (error) {
        console.error('Reset password error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/update-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) return res.status(400).json({ message: 'Password is required' }); // incomplete as password requirements are unknown
        if (!token) return res.status(400).json({ message: 'Token is required' });

        const user = await prisma.user.findFirst({
            where: { resetToken: token }
        })
        if (!user) return res.status(404).json({ message: 'Token not found' });
        if (new Date() > user.resetTokenExpiry) res.status(400).json({ message: 'Token expired' });

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        return res.status(200).json({ message: 'Password changed succesfully' });
    } catch (error) {
        console.error('Update password error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;