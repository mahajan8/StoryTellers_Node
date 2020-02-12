
'use strict';
module.exports = function(app) {

    var usersController = require('../controllers/usersController')

    app.route('/signup')
    .post(usersController.signup);

    app.route('/login')
    .post(usersController.login);
};