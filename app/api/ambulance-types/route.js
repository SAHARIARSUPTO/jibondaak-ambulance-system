"use client";

import { useEffect, useState } from "react";

export default function ProviderDashboard() {
  const [stats, setStats] = useState({
    totalAmbulance: 0,
    activeTrips: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    // Example fetch (you can replace with real API)
    setStats({
      totalAmbulance: 5,
      activeTrips: 2,
      completedTrips: 20,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center py-6">
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Provider Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Add Ambulance
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Ambulance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-gray-500 text-sm">Total Ambulance</h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalAmbulance}
            </p>
          </div>

          {/* Active Trips */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-gray-500 text-sm">Active Trips</h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.activeTrips}
            </p>
          </div>

          {/* Completed Trips */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-gray-500 text-sm">Completed Trips</h2>
            <p className="text-3xl font-bold text-green-600">
              {stats.completedTrips}
            </p>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3">
            <li className="border-b pb-2">
              Ambulance #1 completed a trip
            </li>
            <li className="border-b pb-2">
              New booking request received
            </li>
            <li>
              Ambulance #3 started a trip
            </li>
          </ul>
        </div>

      </main>

    </div>
  );
}