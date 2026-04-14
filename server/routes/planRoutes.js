const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Plan routes
router.get('/', planController.getAllPlans);
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

module.exports = router;
