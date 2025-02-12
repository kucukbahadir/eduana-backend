const UserService = require("../services/userService");

class UserController {
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            await UserService.requestPasswordReset(email);
            
            console.log(`Password reset requested for: ${email}`);
            return res.status(200).json({ message: `Password reset confirmation sent to: ${email}` });
        } catch (error) {
            console.error('Reset password request error: ', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    async changePassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            await UserService.changePassword(token, password);

            console.log('Password changed successfully');
            return res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Update password error: ', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();