const AWS = require('aws-sdk');
const BOOKING_TABLE = process.env.BOOKING_TABLE;
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.createBooking = async (req, res) => {
  try {
    const bookingId = `booking_${Date.now()}`;
    const userId = req.user.sub;
    const { vendorId, service, date, notes } = req.body;

    const item = {
      bookingId,
      userId,
      vendorId,
      service,
      date,
      notes,
      status: 'pending',
    };

    await dynamodb.put({ TableName: BOOKING_TABLE, Item: item }).promise();
    res.json({ message: 'Booking created', bookingId });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.sub;

    const data = await dynamodb.query({
      TableName: BOOKING_TABLE,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    }).promise();

    res.json(data.Items);
  } catch (err) {
    console.error('getUserBookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.user.sub;

    const data = await dynamodb.query({
      TableName: BOOKING_TABLE,
      IndexName: 'VendorIndex',
      KeyConditionExpression: 'vendorId = :v',
      ExpressionAttributeValues: { ':v': vendorId },
    }).promise();

    res.json(data.Items);
  } catch (err) {
    console.error('getVendorBookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
