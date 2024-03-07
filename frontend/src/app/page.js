"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', email: '', hobbies: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/getUser');
      console.log(response.data.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error when field changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:5000/api/v1/postUser', formData);
        fetchUsers();
        setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
      valid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    if (!formData.hobbies) {
      newErrors.hobbies = 'Hobbies are required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSendEmail = async () => {
    const selectedUsers = users.filter(user => user.selected);
    const emailData = selectedUsers.map(user => `${user.name}, ${user.phoneNumber}, ${user.email}, ${user.hobbies}`).join('\n');

    try {
      await axios.post('http://localhost:5000/api/v1/send-email', {
        email: 'vikaskashyap1334@gmail.com',
        subject: 'Selected Users Data',
        text: emailData
      });
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };
  const handleUpdate = async (id) => {
    if (validateForm()) {
      try {
        await axios.put(`http://localhost:5000/api/v1/User/${id}`, formData);
        fetchUsers();
        setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/User/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className={`border p-2 ${errors.name && 'border-red-500'}`}
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className={`border p-2 ${errors.phoneNumber && 'border-red-500'}`}
            required
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`border p-2 ${errors.email && 'border-red-500'}`}
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input
            type="text"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="Hobbies"
            className={`border p-2 ${errors.hobbies && 'border-red-500'}`}
            required
          />
          {errors.hobbies && <p className="text-red-500">{errors.hobbies}</p>}
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>

      {/* Table */}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Hobbies</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const selected = e.target.checked;
                    setUsers(users.map((u, i) => (i === index ? { ...u, selected } : u)));
                  }}
                />
              </td>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.phoneNumber}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.hobbies}</td>
              <td className="px-4 py-2">
              <button onClick={() => handleUpdate(user._id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Update
                </button>
                <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="mt-8">
        <button onClick={handleSendEmail} className="bg-green-500 text-white px-4 py-2 rounded mr-4">
          Send
        </button>
        <button onClick={() => alert('Open popup form to add new data')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Data
        </button>
      </div>
    </div>
  );
};

export default Home;
