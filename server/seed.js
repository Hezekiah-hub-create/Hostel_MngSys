require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const DiningTable = require('./models/DiningTable');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms-db';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB for Seeding...');

    // Clear existing
    await User.deleteMany();
    await Room.deleteMany();
    await DiningTable.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash('password123', salt);

    // Initial Users
    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@hms.com', password: hashPwd, role: 'admin' },
      { name: 'Hotel Manager', email: 'manager@hms.com', password: hashPwd, role: 'manager' },
      { name: 'Front Desk', email: 'reception@hms.com', password: hashPwd, role: 'receptionist' },
      { name: 'John Doe', email: 'client@hms.com', password: hashPwd, role: 'client' },
    ]);

    // Base Room Types
    const roomTypes = [
      { type: 'Classic King', price: 2500, amenities: ['WiFi', 'Smart TV', 'Mini Bar', 'City View'], imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      { type: 'Classic Double', price: 2800, amenities: ['WiFi', 'Smart TV', 'Mini Bar', 'City View'], imageUrl: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      { type: 'Deluxe Ocean View', price: 4500, amenities: ['WiFi', 'Smart TV', 'Balcony', 'Ocean View', 'Room Service'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      { type: 'Executive Suite', price: 6500, amenities: ['WiFi', 'Apple TV', 'Private Lounge', 'Ocean View', 'Butler'], imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      { type: 'Honeymoon Suite', price: 8000, amenities: ['WiFi', 'Jacuzzi', 'Champagne Bar', 'Ocean View', 'Spa Access'], imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
      { type: 'Presidential Suite', price: 15000, amenities: ['WiFi', 'Private Pool', 'Kitchen', 'Helipad Access', '24/7 Butler'], imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
    ];

    const generatedRooms = [];
    
    // Generate 70 rooms (10 on 7 floors)
    for (let floor = 1; floor <= 7; floor++) {
      for (let num = 1; num <= 10; num++) {
        const roomNumber = `${floor}${num < 10 ? '0' + num : num}`;
        
        let typeObj;
        // Distribute room types
        if (floor <= 3) typeObj = roomTypes[0]; // Classic King
        else if (floor <= 4) typeObj = roomTypes[1]; // Classic Double
        else if (floor === 5) typeObj = roomTypes[2]; // Deluxe Ocean View
        else if (floor === 6 && num <= 5) typeObj = roomTypes[3]; // Executive Suite
        else if (floor === 6 && num > 5) typeObj = roomTypes[4]; // Honeymoon Suite
        else typeObj = roomTypes[5]; // Top floor = Presidential

        generatedRooms.push({
          roomNumber,
          type: typeObj.type,
          price: typeObj.price,
          status: Math.random() > 0.85 ? 'Booked' : 'Available', // 15% booked randomly
          amenities: typeObj.amenities,
          imageUrl: typeObj.imageUrl
        });
      }
    }

    await Room.insertMany(generatedRooms);
    
    // Seed Dining Tables
    const diningTables = [
      { tableNumber: 1, capacity: 2, location: 'Main Hall', imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80', description: 'Intimate setting for two.' },
      { tableNumber: 2, capacity: 2, location: 'Main Hall', imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80', description: 'Intimate setting for two.' },
      { tableNumber: 3, capacity: 4, location: 'Main Hall', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Standard family table.' },
      { tableNumber: 4, capacity: 4, location: 'Terrace', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Outdoor dining with a breeze.' },
      { tableNumber: 5, capacity: 6, location: 'Terrace', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Large group seating on the terrace.' },
      { tableNumber: 6, capacity: 2, location: 'Rooftop', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Private rooftop escape.' },
      { tableNumber: 7, capacity: 8, location: 'Private Room', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', description: 'Exclusive private dining.' },
      { tableNumber: 8, capacity: 2, location: 'Wine Cellar', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80', description: 'Atmospheric wine cellar dining.' },
    ];
    await DiningTable.insertMany(diningTables);

    console.log('Seed Data Inserted Successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
