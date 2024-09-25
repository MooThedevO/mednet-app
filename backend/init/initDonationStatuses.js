const DonationStatus = require('../models/DonationStatus');

const initDonationStatuses = async () => {
  try {
    await DonationStatus.bulkCreate([
        { status: 'Pending', description: 'Donation request is waiting to be fulfilled' },
        { status: 'Accepted', description: 'Donation request has been accepted' },
        { status: 'Fulfilled', description: 'Donation request has been fulfilled' },
        { status: 'Cancelled', description: 'Donation request has been cancelled' }
        ], {
      ignoreDuplicates: true, // This will prevent recreating the forms if they already exist
    });
    console.log('Donation statuses initialized successfully');
  } catch (error) {
    console.error('Error initializing Donation statuses:', error);
  }
};

module.exports = initDonationStatuses;