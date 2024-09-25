// routes/medicationRequestRoutes.js
const express = require('express');
const {
  getAllRequests,
  getRequestById,
  addRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/medicationRequestController');
const { authMiddleware, authorizeSelf } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRequests);
router.get('/:requestId', getRequestById);

// Protected routes
router.post('/', [authMiddleware], addRequest);
router.put('/:requestId', [authMiddleware, authorizeSelf()], updateRequest);
router.delete('/:requestId', [authMiddleware, authorizeSelf()], deleteRequest);

module.exports = router;
