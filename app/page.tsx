'use client'


import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CheckIcon,  DocumentDuplicateIcon } from '@heroicons/react/20/solid';

interface WifiPassword {
    id: number;
    network_name: string;
    password: string;
    business_name?: string;
    city?: string;
    state?: string;
    country?: string;
}

export default function Home() {
    const [networkName, setNetworkName] = useState('');
    const [password, setPassword] = useState('');
    const [state, setState] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.from('wifi_passwords').insert([
            {
                network_name: networkName,
                password: password,
                business_name: businessName,
                city: city,
                state: state,
                country: country,
            },
        ]);
        if (error) {
            console.error('Error adding WiFi password:', error);
        } else {
            alert('WiFi password added successfully');
            if (data) {
                setWifiList((prev) => [...prev, data[0]]);
            }
            setNetworkName('');
            setPassword('');
            setBusinessName('');
            setCity('');
            setCountry('');
        }
    };

    
    const handleCopyPassword = (wifiId: number, password: string) => {
        navigator.clipboard.writeText(password);
        setCopiedId(wifiId);

        // Reset the copied state after 2 seconds
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Public WiFi Passwords</h1>
<ul className="space-y-4 mb-8">
                    {wifiList.map((wifi) => (
                        <li key={wifi.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-3">
                                <h1 className="text-xl font-bold">
                                    {wifi.business_name}
                                </h1>
                                <h2 className="text-xl">network - {wifi.network_name}</h2>
                               <div className="flex items-center justify-between gap-2">
                            <p className="text-xl">
                                <span className=""> password - {wifi.password}</span>
                            </p>
                                        <button
                                    onClick={() => handleCopyPassword(wifi.id, wifi.password)}
                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    {copiedId === wifi.id ? <CheckIcon width={24} height={24} /> : <DocumentDuplicateIcon width={24} height={24} />}
                                </button>
                               </div>
                            {wifi.city && wifi.state &&
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {wifi.city}, {wifi.state}
                            </p>
                            }
                        </li>
                    ))}
                </ul>
                {!showForm &&
                    <button
                        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        onClick={() => setShowForm(prevState => !prevState)}>Add new network</button>
                }
                {showForm && 
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Network Name:</label>
                        <input
                            type="text"
                            value={networkName}
                            onChange={(e) => setNetworkName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Password:</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Business Name:</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">City (Optional):</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">State (Optional):</label>
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Country (Optional):</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                        Add WiFi Password
                    </button>
                </form>
                }
            </div>
        </div>
    );
}
