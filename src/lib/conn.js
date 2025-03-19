import mongoose from "mongoose"; // using mongoose to create connection
// this is updated
const options={
    
}
let isConnected = false;

const conn = async () => {
  // If already connected, return the existing connection
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Update the connection status
    isConnected = !!connection.connections[0].readyState;
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

// Export the connection function for reuse
export default conn;