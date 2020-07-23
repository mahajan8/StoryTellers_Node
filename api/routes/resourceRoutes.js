
'use strict';
module.exports = function(app) {

    var resourceController = require('../controllers/resourceController')

    app.route('/getCategories')
    .get(resourceController.getCategories);

    app.route('/support')
    .post(resourceController.support);

    app.route('/getQueryString')
    .get(resourceController.getQueryString);
};