
'use strict';
module.exports = function(app) {

    var adminController = require('../controllers/adminController')

    app.route('/adminLogin')
    .post(adminController.adminLogin);

};