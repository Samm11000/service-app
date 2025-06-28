const AWS = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;

const s3 = new AWS.S3();

exports.uploadToS3 = (file, key) => {
  return s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }).promise();
};
