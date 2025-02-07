const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'running'
    };
    
    res.status(200).json(healthStatus);
});

module.exports = router;
