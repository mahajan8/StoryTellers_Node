
'use strict';
module.exports = function(app) {

    var storyController = require('../controllers/storyController')

    app.route('/addStory')
    .post(storyController.addStory);

    app.route('/addStoryReply')
    .post(storyController.addStoryReply);

    app.route('/getStories')
    .post(storyController.getStories);

    app.route('/getStoryDetails')
    .post(storyController.getStoryDetails);

    app.route('/getMyStories')
    .post(storyController.getMyStories);

    app.route('/toggleFavorite')
    .post(storyController.toggleFavorite);

};