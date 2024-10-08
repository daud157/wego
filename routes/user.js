const router = require('express').Router();

// Import your controller functions
const {
  registerNewUser,
  loginUser,
  getLoggedInUser,
  addDriverProfile,
  updateCurrentStatusofUser,
} = require('../controllers/user');

// Import the findNearestDriver function
const { findNearestDriver } = require('../controllers/driver');

// Define the routes
router.post('/register', registerNewUser)
  .post('/login', loginUser)
  .post('/', getLoggedInUser)
  .post('/addDriverProfile', addDriverProfile)
  .post('/updateCurrentStatus', updateCurrentStatusofUser)
  .post('/drivers/nearest', findNearestDriver);  // Added nearest driver route

module.exports = router;
