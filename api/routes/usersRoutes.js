
'use strict';
module.exports = function(app) {

    var usersController = require('../controllers/usersController')

    app.route('/signup')
    .post(usersController.signup);

    app.route('/login')
    .post(usersController.login);

    app.route('/forgotPassword')
    .post(usersController.forgotPassword);

    app.route('/verifyOtp')
    .post(usersController.verifyOtp);
};