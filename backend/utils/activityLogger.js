const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ user, action, description, entityType, entityId }) => {
  try {
    await ActivityLog.create({ user, action, description, entityType, entityId });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

module.exports = logActivity;
