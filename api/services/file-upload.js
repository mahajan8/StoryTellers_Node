var aws = require('aws-sdk')
var express = require('express')
var multer = require('multer')
var multerS3 = require('multer-s3')
const path = require( 'path' );


var s3 = new aws.S3()
// secretAccessKey:'cgs0lC/Zu5/58LYLrZ6GxI2R4FIBz5gZ8WjWxDAb',
//     accessKeyId:'AKIAJZFE6XFQZLVOI6HA',

aws.config.update({
    secretAccessKey: process.env.awsSecretKey,
    accessKeyId: process.env.awsAccessKey,
    region: process.env.awsRegion
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
    bucket: 'dev.storytellers',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    },
  })
})

module.exports = upload;