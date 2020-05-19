
'use strict';
module.exports = function(app) {

    var usersController = require('../controllers/usersController')
    var profileController = require('../controllers/profileController')
    var storyController = require('../controllers/storyController')
    var resourceController = require('../controllers/resourceController')

    app.route('/signup')
    .post(usersController.signup);

    app.route('/login')
    .post(usersController.login);

    app.route('/getProfile')
    .post(profileController.getProfile);

    app.route('/editProfile')
    .post(profileController.editProfile);

    app.route('/addStory')
    .post(storyController.addStory);

    app.route('/addStoryReply')
    .post(storyController.addStoryReply);

    app.route('/getStories')
    .get(storyController.getStories);

    app.route('/getStoryDetails')
    .post(storyController.getStoryDetails);

    app.route('/getMyStories')
    .post(storyController.getMyStories);

    app.route('/toggleFavorite')
    .post(storyController.toggleFavorite);

    app.route('/uploadImage')
    .post(profileController.uploadPic)





    app.route('/getCategories')
    .get(resourceController.getCategories);
};