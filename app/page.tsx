'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface WifiPassword {
    id: number;
    network_name: string;
    password: string;
    business_address?: string;
    city?: string;
    country?: string;
}

export default function Home() {
  const [networkName, setNetworkName] = useState('');
  const [password, setPassword] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

    const [wifiList, setWifiList] = useState<WifiPassword[]>([]);

    useEffect(() => {
        const fetchWifiPasswords = async () => {
            const { data, error } = await supabase.from('wifi_passwords').select('*');
            if (error) {
                console.error('Error fetching data:', error);
            } else if (data) {
                setWifiList(data);
            }
        };
        fetchWifiPasswords();
    }, []);

  // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.from('wifi_passwords').insert([
      {
        network_name: networkName,
        password: password,
        business_address: businessAddress,
        city: city,
        country: country,
      },
    ]);
    if (error) {
      console.error('Error adding WiFi password:', error);
    } else {
      alert('WiFi password added successfully');
      if (data){
      setWifiList((prev) => [...prev, data[0]]);
        }
      setNetworkName('');
      setPassword('');
      setBusinessAddress('');
      setCity('');
      setCountry('');
    }
  };

  return (
    <div>
      <h1>WiFi Passwords List</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Network Name:</label>
          <input
            type="text"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Business Address:</label>
          <input
            type="text"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City (Optional):</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label>Country (Optional):</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <button type="submit">Add WiFi Password</button>
      </form>

      <h2>Stored WiFi Passwords</h2>
      <ul>
        {wifiList.map((wifi) => (
          <li key={wifi.id}>
            <strong>{wifi.network_name}</strong>: {wifi.password} <br />
            Address: {wifi.business_address}, {wifi.city}, {wifi.country}
          </li>
        ))}
      </ul>
    </div>
  );
}
