const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'weyoungins';
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const registerNewUser = async (req, res) => {
  try {
    console.log('Incoming data:', req.body);
    const { data } = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = new User(data);
    await user.save();
    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET);

    return res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET);
    return res.status(200).json({ message: 'User logged in successfully', token, user });
  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(400).json({ error: error.message });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const { token } = req.body;

    const userData = jwt.verify(token, JWT_SECRET);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const user = await User.findOne({ email: userData.email });
    return res.status(200).json({ message: 'User fetched:', data: user });
  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Add Driver Profile
const addDriverProfile = async (req, res) => {
  try {
    const { token, data } = req.body;

    const userData = jwt.verify(token, JWT_SECRET);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(userData.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isDriver) {
      return res.status(400).json({ error: 'User is already a driver' });
    }
    user.driverProfile = data;
    user.isDriver = true;

    await user.save();

    return res.status(200).json({ message: 'Driver profile added successfully', data: user });
  } catch (error) {
    console.error('Error adding driver profile:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Update Driver Profile
const updateDriverProfile = async (req, res) => {
  try {
    const { token, driverProfile } = req.body;

    const userData = jwt.verify(token, JWT_SECRET);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(userData.id);
    if (!user || !user.isDriver) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    // Update the driver profile
    user.driverProfile = { ...user.driverProfile, ...driverProfile };

    await user.save();

    return res.status(200).json({ message: 'Driver profile updated successfully', data: user });
  } catch (error) {
    console.error('Error updating driver profile:', error);
    return res.status(400).json({ error: error.message });
  }
};

const updateCurrentStatusofUser = async (req, res) => {
  try {
    const { token, updatedStatus } = req.body;
    console.log("🚀 ~ updateCurrentStatusofUser ~ status:", updatedStatus)

    const userData = jwt.verify(token, JWT_SECRET);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(userData.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.currentProfileStatus = updatedStatus;

    await user.save();

    return res.status(200).json({ message: 'User status updated successfully', user: user });

  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(400).json({ error: error.message });
  }
}


// Find Nearest Driver API

const findNearestDriver = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;  // Passenger's location

    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Find the nearest available and verified driver within 1km (1000 meters)
    const nearestDriver = await User.findOne({
      isDriver: true,  // Only drivers
      'driverProfile.isVerified': true,  // Only verified drivers
      'driverProfile.location': {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],  // Passenger's coordinates
          },
          $maxDistance: 1000  // 1km radius (1000 meters)
        }
      }
    });

    // If no drivers found
    if (!nearestDriver) {
      return res.status(404).json({ error: 'No drivers available nearby' });
    }

    // Respond with the nearest driver details
    return res.status(200).json({
      success: true,
      driver: {
        name: nearestDriver.firstname,
        vehicleType: nearestDriver.driverProfile.vehicleType,
        vehicleNumber: nearestDriver.driverProfile.vehicleNumber,
        location: nearestDriver.driverProfile.location.coordinates,
      }
    });
  } catch (error) {
    console.error('Error finding nearest driver:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  registerNewUser,
  loginUser,
  getLoggedInUser,
  addDriverProfile,
  updateDriverProfile,
  updateCurrentStatusofUser,
  findNearestDriver,
};
