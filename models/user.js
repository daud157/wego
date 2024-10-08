// const { Schema, model } = require('mongoose');

// const driverProfileSchema = new Schema({
//     licenseNumber: {
//         type: String,
//         required: true,
//     },
//     vehicleType: {
//         type: String,
//         required: true,
//     },
//     vehicleNumber: {
//         type: String,
//         required: true,
//     },
//     isVerified: {
//         type: Boolean,
//         default: false,
//     },
// });

// const userSchema = new Schema({
//     firstname: {
//         type: String,
//         required: true,
//     },
//     lastname: {
//         type: String,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     phoneNumber: {
//         type: String,
//     },
//     currentProfileStatus:{
//             type:String,
//             enum:['driver','passenger'],
//         },
//     isDriver: {
//         type: Boolean,
//         default: false,
//     },
//     driverProfile: {
//         type: driverProfileSchema,
//         default: null,
//     },
// });

// const User = model('User', userSchema);

// module.exports = User;

const { Schema, model } = require('mongoose');

const driverProfileSchema = new Schema({
  licenseNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },  // GeoJSON format: [longitude, latitude]
  },
});

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  currentProfileStatus: { type: String, enum: ['driver', 'passenger'] },
  isDriver: { type: Boolean, default: false },
  driverProfile: { type: driverProfileSchema, default: null },
});

// Create GeoJSON 2dsphere index for spatial queries
userSchema.index({ 'driverProfile.location': '2dsphere' });

const User = model('User', userSchema);
module.exports = User;
