
var { saleItem, getSaleHistory, deleteSale } = require('../controllers/poSsaleController');
var { validate_token } = require('../middleware/auth');
// var auth = require('../auth/middleware');
const Sale = (app) => {
    app.get('/api/sale', getSaleHistory);
    app.post('/api/sale', saleItem);
    app.delete('/api/sale/:sale_id', deleteSale);
    // app.post('/api/user' ,validate_token(), Create);
    // app.put('/api/user' ,validate_token(), Update);
    // app.post('/api/user/login' ,login);
    // app.post('/api/user/sendOTP' ,sendOTP);
    // app.post('/api/user/verifyOTP' ,verifyOtp);
    // app.post('/api/user/resetPassword' ,resetPassword);
    // app.delete('/api/user/:id' ,validate_token(), Delete);

}


module.exports = Sale ;