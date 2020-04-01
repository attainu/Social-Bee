const express = require('express');
const {
  register,
  login,
  //   logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateprofilepic
  // updatePassword
} = require('../controllers/UserController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
// router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updateprofilepic', protect, updateprofilepic);
// router.put('/updatepassword', protect, updatePassword); // This won't be necessary now.

module.exports = router;
