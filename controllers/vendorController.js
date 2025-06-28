const AWS = require('aws-sdk');
const { uploadToS3 } = require('../utils/s3Upload');
const VENDOR_TABLE = process.env.VENDOR_TABLE;

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.sub;

    const data = await dynamodb.get({
      TableName: VENDOR_TABLE,
      Key: { vendorId },
    }).promise();

    if (!data.Item) return res.status(404).json({ error: 'Vendor not found' });

    res.json(data.Item);
  } catch (err) {
    console.error('Error in getVendorProfile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.sub;
    const { name, phone, bio, servicesOffered, city } = req.body;

    await dynamodb.update({
      TableName: VENDOR_TABLE,
      Key: { vendorId },
      UpdateExpression: 'set #n = :n, phone = :p, bio = :b, servicesOffered = :s, city = :c',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':n': name,
        ':p': phone,
        ':b': bio,
        ':s': servicesOffered,
        ':c': city,
      },
    }).promise();

    res.json({ message: 'Vendor profile updated' });
  } catch (err) {
    console.error('Error in updateVendorProfile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.uploadVendorImage = async (req, res) => {
  try {
    const vendorId = req.user.sub;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await uploadToS3(file, `vendors/${vendorId}/profile.jpg`);
    const imageUrl = result.Location;

    await dynamodb.update({
      TableName: VENDOR_TABLE,
      Key: { vendorId },
      UpdateExpression: 'set image = :i',
      ExpressionAttributeValues: { ':i': imageUrl },
    }).promise();

    res.json({ message: 'Image uploaded', imageUrl });
  } catch (err) {
    console.error('Error in uploadVendorImage:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
