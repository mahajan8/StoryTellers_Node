var Utils = require('../utils')

exports.addStory = function(req, res) {

    try {

        const {userId, category} = req.body
        
        Utils.checkParams({userId, category}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('storylist')
            let StoryCollection = db.collection('story')

            Utils.getNextSequence(db, 'storylist')
            .then(storyId=>{
                let storylist = {
                    _id: storyId,
                    userId : Number(userId),
                    category: category,
                    title: req.body.title,
                    start: req.body.story,
                    views: 0
                }

                Utils.getNextSequence(db, 'story')
                .then(id=>{

                    let story = {
                        story_id : storyId,
                        _id: id,
                        userId : Number(userId),
                        story: req.body.story,
                    }
    
                    collection.insertOne(storylist, (error, result) => {
                        if(error) throw error;

                        db.collection('userProfile').findAndModify( { user_id: Number(userId) }, null, { $inc: { myStories: 1 } }, function(err, result){
                            if(err) throw err;
                        } );
    
                        StoryCollection.insertOne(story , (err, result) => {
                            if(err) throw err;
    
                            res.send({status: true, message: 'Story Added Successfully.'})
                        })
                    });
                })
                .catch(err=>{throw err})
            })
            .catch(err=>{throw err})
        })

    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}



exports.addStoryReply = function(req, res) {

    try {

        const {userId, storyId} = req.body
        
        Utils.checkParams({userId, storyId}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('story')

            
            Utils.getNextSequence(db, 'story')
            .then(id=>{

                let story = {
                    story_id : Number(storyId),
                    _id: id,
                    userId : Number(userId),
                    story: req.body.story,
                }

                collection.insertOne(story, (error, result) => {
                    if(error) throw error;

                    db.collection('userProfile').findAndModify( { user_id: Number(userId) }, null, { $inc: { contributions: 1 } }, function(err, result){
                        if(err) throw err;
                    } );

                    res.send({status: true, message: 'Added to Story Successfully.'})
                   
                });
            })
            .catch(err=>{throw err})
        })
    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}

exports.getStories = function(req, res) {

    try {

        let db = req.app.locals.db
        let collection = db.collection('storylist')

        collection.aggregate([
            { $lookup:
                {
                    from: 'userProfile',
                    let: {userId: '$userId'} ,
                    as: 'userInfo',
                    pipeline: [
                        {$match: {'$expr': {'$eq': ['$user_id', '$$userId']}}},

                        {$project: {
                            _id: 0, 
                            name : {"$concat": [ "$firstName", " ", "$lastName"]}, 
                            profilePic:1, 
                            user_id:1
                        }}
                    ]
                }
            },
            {$unwind: '$userInfo'}
            ]).toArray((err, response)=> {
            if(err) throw err;

            res.send({status: true, response: response})
        })

        
        

    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}

exports.getStoryDetails = function(req, res) {

    try {

        const {storyId} = req.body

        let db = req.app.locals.db
        let collection = db.collection('story')
        
        Utils.checkParams({ storyId}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }
            // .find({story_id : Number(storyId)})
            collection.aggregate([
                { $match: {story_id: Number(storyId)} },
                { $lookup:
                    {
                        from: 'userProfile',
                        let: {userId: '$userId'} ,
                        as: 'userInfo',
                        pipeline: [
                            {$match: {'$expr': {'$eq': ['$user_id', '$$userId']}}},

                            {$project: {
                                _id: 0, 
                                name : {"$concat": [ "$firstName", " ", "$lastName"]}, 
                                profilePic:1, 
                                user_id:1
                            }}
                        ]
                    }
                },
                {$unwind: '$userInfo'}
            ]).toArray((err, response)=> {
                if(err) throw err;

                db.collection('storylist').findAndModify( { _id: Number(storyId) }, null, { $inc: { views: 1 } }, function(err, result){
                    if(err) throw err;
                } );
                if(!response.length) {
                    res.send({status: false, message: 'No Stories found.'})
                } else {
                    res.send({status: true, response: response})
                }
                
            })

        })
        

    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}

exports.getMyStories = function(req, res) {

    try {

        const {userId} = req.body

        Utils.checkParams({ userId}, (err, param)=>{
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

        let db = req.app.locals.db
        let collection = db.collection('storylist')
        let profile = db.collection('userProfile')

        profile.findOne({user_id : Number(userId)}, (error, result) => {
            if(error) {
                throw error
            }
            if(!result) {
                res.send({status: false, message: "User does not exist."})
            } else {
                let fav = result.favorites
                let myStories=[]
                let favorites=[]

                collection.aggregate([
                    { $match: {_id: {$in: fav}} },
                    { $lookup:
                        {
                            from: 'userProfile',
                            let: {userId: '$userId'} ,
                            as: 'userInfo',
                            pipeline: [
                                {$match: {'$expr': {'$eq': ['$user_id', '$$userId']}}},

                                {$project: {
                                    _id: 0, 
                                    name : {"$concat": [ "$firstName", " ", "$lastName"]}, 
                                    profilePic:1, 
                                    user_id:1
                                }}
                            ]
                        }
                    },
                    {$unwind: '$userInfo'}
                    ]).toArray((err, response)=> {
                        if(err) throw err;

                        favorites = response
                    })

                collection.aggregate([
                    { $match: {userId: Number(userId)} },
                    { $lookup:
                        {
                            from: 'userProfile',
                            let: {userId: '$userId'} ,
                            as: 'userInfo',
                            pipeline: [
                                {$match: {'$expr': {'$eq': ['$user_id', '$$userId']}}},

                                {$project: {
                                    _id: 0, 
                                    name : {"$concat": [ "$firstName", " ", "$lastName"]}, 
                                    profilePic:1, 
                                    user_id:1
                                }}
                            ]
                        }
                    },
                    {$unwind: '$userInfo'}
                    ]).toArray((err, response)=> {
                    if(err) throw err;

                    myStories=response
                })


                res.send({status: true, response: { myStories: myStories, favorites: favorites }})
            }
        });

    })
        

    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}

// exports.getMyStories = function(req, res) {

//     try {

//         const {userId} = req.body

//         Utils.checkParams({ userId}, (err, param)=>{
//             if(err) {
//                 res.status(500).send({status: false, message: `${param} Required`});
//                 return;
//             }

//         let db = req.app.locals.db
//         let collection = db.collection('storylist')

//         collection.aggregate([
//             { $match: {userId: Number(userId)} },
//             { $lookup:
//                 {
//                     from: 'userProfile',
//                     let: {userId: '$userId'} ,
//                     as: 'userInfo',
//                     pipeline: [
//                         {$match: {'$expr': {'$eq': ['$user_id', '$$userId']}}},

//                         {$project: {
//                             _id: 0, 
//                             name : {"$concat": [ "$firstName", " ", "$lastName"]}, 
//                             profilePic:1, 
//                             user_id:1
//                         }}
//                     ]
//                 }
//             },
//             {$unwind: '$userInfo'}
//             ]).toArray((err, response)=> {
//             if(err) throw err;

//             res.send({status: true, response: response})
//         })

//     })
        

//     } catch(err) {
//         res.status(500).send({status: false, message: 'Error Adding Story.'});
//     }
// }

exports.toggleFavorite = function(req, res) {

    try {

        const {userId, storyId} = req.body

        Utils.checkParams({ userId, storyId}, (err, param)=>{
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

        let db = req.app.locals.db
        let collection = db.collection('userProfile')
                
        collection.findOne({user_id : Number(userId)}, (error, result) => {
            if(error) {
                throw error
            }
            if(!result) {
                res.send({status: false, message: "User does not exist."})
            } else {

                let fav = result.favorites
                let storyId = Number(req.body.storyId)
                console.log(storyId)
                if(fav.includes(storyId)) {
                    fav = fav.filter(obj=>obj!=storyId)
                } else {
                    fav.push(storyId)
                }
                console.log(fav)

                collection.updateOne(
                    {user_id : Number(userId)},
                    { $set: { favorites: fav } },
                    (err, response)=> {
                        if (err) throw err;

                        res.send({status: true, message: fav.includes(storyId)?'Added':'Removed'})
                    }
                )
            }
        });
    

    })
        

    } catch(err) {
        res.status(500).send({status: false, message: 'Error Adding Story.'});
    }
}
