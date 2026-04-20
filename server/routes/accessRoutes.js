const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');

router.get('/eligible-users', accessController.getEligibleUsers);
router.post('/grant', accessController.grantAccess);
router.post('/revoke', accessController.revokeAccess);

module.exports = router;
