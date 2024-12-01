const User = require('./model/userModel');  

const trackSession = async (userId, sessionData) => {
  if (!sessionData || typeof sessionData !== 'object') {
    throw new Error('Invalid session data');
  }

  // Find the user by ID
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Add new session data to the user's session history
  user.sessions = user.sessions || []; // Ensure sessions array exists
  user.sessions.push({
    ...sessionData,
    timestamp: new Date()
  });

  // Save the updated user document
  await user.save();
  
  return user;
};

module.exports = trackSession