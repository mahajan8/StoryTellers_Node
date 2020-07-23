
'use strict';
module.exports = function(app) {

    var profileController = require('../controllers/profileController')

    app.route('/getProfile')
    .post(profileController.getProfile);

    app.route('/editProfile')
    .post(profileController.editProfile);

    app.route('/uploadImage')
    .post(profileController.uploadPic);

    app.route('/changePassword')
    .post(profileController.changePassword);
};