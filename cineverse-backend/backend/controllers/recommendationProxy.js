// controllers/recommendationProxy.js
const axios = require('axios');
const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://localhost:6000';

exports.getForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const resp = await axios.get(`${ML_SERVICE}/user/${userId}?n=10`);
    return res.json(resp.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'ML service error' });
  }
};
