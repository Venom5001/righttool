'use client';
import { useState } from 'react';

export default function VehicleSelector() {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  const makes = ['Dodge', 'Honda', 'Ford', 'Toyota', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Jeep'];
  const modelsByMake = {
    Dodge: ['Dart', 'Charger', 'Challenger', 'Durango', 'Journey'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
    Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Fusion'],
    Toyota: ['Camry', 'Corolla', 'Tacoma', 'RAV4', 'Highlander'],
    Chevrolet: ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro'],
    Nissan: ['Altima', 'Rogue', 'Sentra', 'Titan', 'Pathfinder'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
    Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Renegade', 'Compass'],
  };

  const models = make ? modelsByMake[make] || [] : [];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-8 mx-auto max-w-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Select Your Vehicle</h2>
      <div className="flex flex-col md:flex-row justify-center">
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="p-2 m-2 border rounded w-full md:w-auto"
        >
          <option value="">Select Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
          className="p-2 m-2 border rounded w-full md:w-auto"
        >
          <option value="">Select Make</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          className="p-2 m-2 border rounded w-full md:w-auto"
        >
          <option value="">Select Model</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}