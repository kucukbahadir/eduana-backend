import AdminService from '../sevices/adminService';
const express = require('express');
const router = express.Router();

const adminController = new AdminController

router.post('/role', (req, res) => adminController.changeUserRole(req ,res));

module.exports = router;
