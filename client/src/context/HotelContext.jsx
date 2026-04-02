import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const HotelContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]); // For Manager/Admin
  const [loadingData, setLoadingData] = useState(false);

  // Helper to get auth header
  const getHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchRooms = async () => {
    try {
      setLoadingData(true);
      const { data } = await axios.get(`${API_URL}/rooms`);
      setRooms(data);
    } catch (error) {
      console.error('Fetch rooms error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bookings`, getHeader());
      setBookings(data);
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  };

  const fetchUsers = async () => {
     try {
       const { data } = await axios.get(`${API_URL}/users`, getHeader());
       setUsers(data);
     } catch (error) {
       console.error('Fetch users error:', error);
     }
  };

  const bookRoom = async (roomId, checkInDate, checkOutDate, totalPrice) => {
    try {
      await axios.post(`${API_URL}/bookings`, { roomId, checkInDate, checkOutDate, totalPrice }, getHeader());
      await fetchRooms();
      await fetchBookings();
    } catch (error) {
      throw error.response?.data?.message || 'Booking failed';
    }
  };

  const handleWalkIn = async (name, email, password) => {
     try {
       await axios.post(`${API_URL}/users/walk-in`, { name, email, password }, getHeader());
       await fetchUsers();
     } catch (error) {
       throw error.response?.data?.message || 'Walk-in registration failed';
     }
  };

  const updateBookingStatus = async (id, status) => {
     try {
       await axios.put(`${API_URL}/bookings/${id}/status`, { status }, getHeader());
       await fetchBookings();
       await fetchRooms(); // Might change room status back to available
     } catch (error) {
       throw error.response?.data?.message || 'Status update failed';
     }
  };

  const updateBooking = async (id, checkInDate, checkOutDate, totalPrice) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}`, { checkInDate, checkOutDate, totalPrice }, getHeader());
      await fetchBookings();
    } catch (error) {
      throw error.response?.data?.message || 'Booking update failed';
    }
  };

  return (
    <HotelContext.Provider value={{ 
      rooms, bookings, users, loadingData,
      fetchRooms, fetchBookings, fetchUsers, 
      bookRoom, handleWalkIn, updateBookingStatus, updateBooking 
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => useContext(HotelContext);
