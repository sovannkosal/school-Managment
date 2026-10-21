const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logError = require('../utils/logger');
const { IsValid } = require('../utils/prevent');

const generateCustomerId = () => `customer_${Date.now()}`;

const register = async (req, res) => {
  try {
    const { fullname, gmail, phone, password } = req.body;

    if (!IsValid(fullname) || !IsValid(gmail) || !IsValid(password)) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required'
      });
    }

    const existingCustomer = await Customer.findOne({ where: { gmail } });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const customerId = generateCustomerId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      customer_id: customerId,
      fullname,
      gmail,
      phone,
      password: hashedPassword,
      photo: '',
      created_by: null,
      changed_by: null,
      changed_on: null
    });

    const token = jwt.sign({ customer_id: newCustomer.customer_id, gmail: newCustomer.gmail }, process.env.SECRET_KEY || 'secret', {
      expiresIn: '1d'
    });

    return res.json({
      success: true,
      message: 'Customer registered successfully',
      data: newCustomer,
      token
    });
  } catch (error) {
    logError('CustomerController - register', error, res);
  }
};

const login = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    if (!IsValid(gmail) || !IsValid(password)) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const customer = await Customer.findOne({ where: { gmail } });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = jwt.sign({ customer_id: customer.customer_id, gmail: customer.gmail }, process.env.SECRET_KEY || 'secret', {
      expiresIn: '1d'
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: customer,
      token
    });
  } catch (error) {
    logError('CustomerController - login', error, res);
  }
};

const get = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json({ success: true, data: customers });
  } catch (error) {
    logError('CustomerController - get', error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!IsValid(id)) {
      return res.status(400).json({ success: false, message: 'Customer ID is required' });
    }

    const customer = await Customer.findOne({ where: { customer_id: id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    logError('CustomerController - getOne', error, res);
  }
};

const search = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q
      ? {
          [require('sequelize').Op.or]: [
            { fullname: { [require('sequelize').Op.like]: `%${q}%` } },
            { gmail: { [require('sequelize').Op.like]: `%${q}%` } }
          ]
        }
      : {};

    const customers = await Customer.findAll({ where });
    res.json({ success: true, data: customers });
  } catch (error) {
    logError('CustomerController - search', error, res);
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.query;
    if (!IsValid(id)) {
      return res.status(400).json({ success: false, message: 'Customer ID is required' });
    }

    const customer = await Customer.findOne({ where: { customer_id: id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    logError('CustomerController - getProfile', error, res);
  }
};

const update = async (req, res) => {
  try {
    const { customer_id, fullname, gmail, phone } = req.body;
    if (!IsValid(customer_id)) {
      return res.status(400).json({ success: false, message: 'Customer ID is required' });
    }

    const customer = await Customer.findOne({ where: { customer_id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updated = await customer.update({ fullname, gmail, phone, changed_on: new Date() });
    res.json({ success: true, message: 'Customer updated successfully', data: updated });
  } catch (error) {
    logError('CustomerController - update', error, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const { customer_id, oldPassword, newPassword } = req.body;
    if (!IsValid(customer_id) || !IsValid(oldPassword) || !IsValid(newPassword)) {
      return res.status(400).json({ success: false, message: 'Customer ID, old password and new password are required' });
    }

    const customer = await Customer.findOne({ where: { customer_id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const isValid = await bcrypt.compare(oldPassword, customer.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await customer.update({ password: hashedPassword, changed_on: new Date() });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    logError('CustomerController - changePassword', error, res);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!IsValid(id)) {
      return res.status(400).json({ success: false, message: 'Customer ID is required' });
    }

    const customer = await Customer.findOne({ where: { customer_id: id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    logError('CustomerController - deleteCustomer', error, res);
  }
};

module.exports = {
  register,
  login,
  get,
  getOne,
  search,
  update,
  changePassword,
  deleteCustomer,
  getProfile
};
