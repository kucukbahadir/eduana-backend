module.exports = {
    // uses ethereal email for testing purposes
    // for more information refer to: https://www.nodemailer.com/smtp/testing/
    // in short - either...
    //  1. create an account at ethereal.email and use the credentials provided by replacing the objects below
    //  2. log into ethereal.email using the credentials below
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'donny.schulist69@ethereal.email',
            pass: 'hKD9cbjwTwfF6swsjK'
        }
    },
    sender: {
        name: 'Donny Schulist',
        address: 'donny.schulist69@ethereal.email'
    }
};