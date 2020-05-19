var aws = require('aws-sdk')
var express = require('express')
var multer = require('multer')
var multerS3 = require('multer-s3')


var s3 = new aws.S3()

aws.config.update({
    secretAccessKey:'cgs0lC/Zu5/58LYLrZ6GxI2R4FIBz5gZ8WjWxDAb',
    accessKeyId:'AKIAJZFE6XFQZLVOI6HA',
    region:'ap-south-1'
})

// const fileFilter = (req, file, cb) => {

//     if(file.mimetype==='image/jpeg' || file.mimetype==='image/png') {
//         cb(null, true)
//     } else {
//         cb(null, true)
//     }
// }
 
var upload = multer({
    // fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'story-tellers-app',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;