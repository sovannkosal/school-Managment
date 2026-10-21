const { Order, OrderItem, Customer } = require('../models');
const logError = require('../utils/logger');
const { IsValid } = require('../utils/prevent');
const { Op } = require('sequelize');

const generateOrderId = () => `order_${Date.now()}`;

const placeOrder = async (req, res) => {
  try {
    const {
      email,
      fullname,
      adress,
      postalcode,
      status_payment,
      items,
      customer_id,
    } = req.body;

    if (!IsValid(email) || !IsValid(fullname) || !IsValid(adress) || !IsValid(postalcode) || !IsValid(status_payment)) {
      return res.status(400).json({
        success: false,
        message: 'Email, fullname, address, postal code and payment method are required',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    const orderId = generateOrderId();
    const amount = items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return sum + qty * unitPrice;
    }, 0);

    let customerId = null;
    if (customer_id) {
      const customer = await Customer.findOne({ where: { customer_id } });
      if (customer) customerId = customer.customer_id;
    } else {
      const customer = await Customer.findOne({ where: { gmail: email } });
      if (customer) customerId = customer.customer_id;
    }

    await Order.create({
      order_id: orderId,
      email,
      fullname,
      adress,
      postalcode: parseInt(postalcode, 10) || 0,
      customer_id: customerId,
      amount,
      status_payment,
      created_by: customerId || null,
      created_on: new Date(),
      changed_by: null,
      changed_on: null,
    });

    for (const item of items) {
      await OrderItem.create({
        order_id: orderId,
        prd_id: item.prd_id,
        unit_price: parseFloat(item.unit_price) || 0,
        qty: parseFloat(item.qty) || 0,
      });
    }

    return res.json({
      success: true,
      message: 'Order placed successfully',
      data: { order_id: orderId },
    });
  } catch (error) {
    logError('customerOrderController - placeOrder', error, res);
  }
};

const getOrders = async (req, res) => {
  try {
    const { customer_id } = req.query;
    const where = {};
    if (IsValid(customer_id)) where.customer_id = customer_id;

    const orders = await Order.findAll({
      where,
      order: [['created_on', 'DESC']],
      include: [{ model: OrderItem }],
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    logError('customerOrderController - getOrders', error, res);
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const { order_id } = req.params;
    if (!IsValid(order_id)) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findOne({
      where: { order_id },
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    logError('customerOrderController - getOrderDetail', error, res);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    if (!IsValid(order_id)) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findOne({ where: { order_id } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await OrderItem.destroy({ where: { order_id } });
    await order.destroy();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    logError('customerOrderController - cancelOrder', error, res);
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!IsValid(email)) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const orders = await Order.findAll({
      where: { email: { [Op.like]: `%${email}%` } },
      order: [['created_on', 'DESC']],
      include: [{ model: OrderItem }],
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    logError('customerOrderController - getOrderByEmail', error, res);
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getOrderByEmail,
};
