const AWS = require('aws-sdk');
const { uploadToS3 } = require('../utils/s3Upload');
const USER_TABLE = process.env.USER_TABLE;

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.sub;

    const data = await dynamodb.get({
      TableName: USER_TABLE,
      Key: { userId },
    }).promise();

    if (!data.Item) return res.status(404).json({ error: 'User not found' });

    res.json(data.Item);
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { name, phone, bio, skills } = req.body;

    await dynamodb.update({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: 'set #name = :n, phone = :p, bio = :b, skills = :s',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':n': name,
        ':p': phone,
        ':b': bio,
        ':s': skills,
      },
    }).promise();

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.sub;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await uploadToS3(file, `users/${userId}/profile.jpg`);
    const photoUrl = result.Location;

    await dynamodb.update({
      TableName: USER_TABLE,
      Key: { userId },
      UpdateExpression: 'set photo = :p',
      ExpressionAttributeValues: { ':p': photoUrl },
    }).promise();

    res.json({ message: 'Photo uploaded', photoUrl });
  } catch (err) {
    console.error('Error in uploadProfilePhoto:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
