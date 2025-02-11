import AdminService from '../sevices/adminService';
const express = require('express');
const router = express.Router();

const adminService = new AdminService

router.post('/role', (req, res) => adminService.changeUserRole(req ,res));
