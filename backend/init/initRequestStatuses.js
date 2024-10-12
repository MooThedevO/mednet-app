const RequestStatus = require('../models/RequestStatus');

const initRequestStatuses = async () => {
  try {
    await RequestStatus.bulkCreate([
      { status: 'Pending', description: 'Request is waiting to be fulfilled' },
      { status: 'Under Review', description: 'Request is under review by admin' },
      { status: 'Fulfilled', description: 'Request has been fulfilled' },
      { status: 'Awaiting Delivery', description: 'Request has been fulfilled but awaiting delivery' },
      { status: 'Approved for Delivery', description: 'Request approved for delivery' },
      { status: 'Deleted', description: 'Request has been deleted' }  
  ], {
      ignoreDuplicates: true, // This will prevent recreating the forms if they already exist
    });
    console.log('request statuses initialized successfully');
  } catch (error) {
    console.error('Error initializing request statuses:', error);
  }
};

module.exports = initRequestStatuses;