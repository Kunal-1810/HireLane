const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (role === 'recruiter' && !company) {
      return res.status(400).json({ message: 'Company name is required for recruiters' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create({
      name, email, password,
      role: role === 'recruiter' ? 'recruiter' : 'candidate',
      company: role === 'recruiter' ? company : undefined,
    });
    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password || ''))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
};

exports.me = (req, res) => res.json({ user: userPayload(req.user) });
