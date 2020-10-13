const userRoutes = require('./usersRoutes');
const profileRoutes = require('./profileRoutes');
const storyRoutes = require('./storyRoutes');
const resourceRoutes = require('./resourceRoutes');
const adminRoutes = require('./adminRoutes');


module.exports = function(app) {  
    userRoutes(app);
    profileRoutes(app);
    storyRoutes(app);
    resourceRoutes(app);
    adminRoutes(app);
};