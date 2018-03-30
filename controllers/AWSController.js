const mongoose = require("mongoose"),
  AWS = require("aws-sdk"),
  async = require("async"),
  Fs = require("fs"),
  md5 = require("md5");


let pathParams, image, imageName;

AWS.config.loadFromPath("./configs/aws.js");

const s3 = new AWS.S3({ region: 'us-west-1' });
const createMainBucket = callback => {
  // Create the parameters for calling createBucket
  const bucketParams = {
    Bucket: 'mkt-bxs'
  };
  s3.headBucket(bucketParams, function(err, data) {
    if (err) {
      console.log("ErrorHeadBucket", err);
      s3.createBucket(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    } else {
      callback(null, data);
    }
  });
};

const createItemObject = callback => {
  const params = {
    Bucket: 'mkt-bxs',
    Key: `${imageName}`,
    ACL: "public-read",
    Body: image
  };
  s3.putObject(params, function(err, data) {
    if (err) {
      console.log("Error uploading image: ", err);
      callback(err, null);
    } else {
      console.log("Successfully uploaded image on S3", data);
      callback(null, data);
    }
  });
};

exports.upload = (req, res, next) => {
  var tmp_path = req.files.file.path;
  image = Fs.createReadStream(tmp_path);
  imageName =
    md5(req.files.file.originalfileName + req.files.file.size);
  async.series([createMainBucket, createItemObject], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
        return res.status(200).json({ result: `https://s3.us-east-2.amazonaws.com/mkt-bxs/${imageName}` });

    }
  });
};

exports.deletePhoto = function(req, res, next) {
  console.log(req.body);
  s3.deleteObject(
    {
      Bucket: 'mkt-bxs',
      Key: req.body.file
    },
    function(err, data) {
      if (err) {
        return res.json({ err: err });
      } else {
        return res.status(200).json({ success: data });
      }
    }
  );
};