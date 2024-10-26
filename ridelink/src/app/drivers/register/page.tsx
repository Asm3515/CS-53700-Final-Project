"use client";
import { useState } from 'react';
 
export default function DriverRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    phone: '',
    password: '',
  });
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/drivers/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success) {
      alert('Driver registered successfully!');
    } else {
      alert('Registration failed');
    }
  };
 
  return (
<div>
<form onSubmit={handleSubmit} className="space-y-4">
<input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
<input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
<input
          type="text"
          name="licenseNumber"
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
<input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
<input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
<button type="submit" className="bg-blue-600 text-white rounded py-2 px-4">
          Register
</button>
</form>
</div>
  );
}