'use client';

import { useEffect, useMemo, useState } from 'react';

type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  engine: string;
  trim?: string | null;
};

type Job = {
  id: string;
  slug: string;
  title: string;
  category: string;
};

type ToolsApiResponse = {
  vehicle: Vehicle;
  job: Job;
  tools: Array<{
    requirementId: string;
    qty: number;
    notes?: string | null;
    tool: {
      id: string;
      name: string;
      brand?: string | null;
      size?: string | null;
      drive?: string | null;
      spec?: string | null;
      price?: string | null;     // string from API (Decimal stringified)
      buyUrl?: string | null;
    };
  }>;
  message?: string;
  error?: string;
};

export default function VehicleSelector() {
  // Data from APIs
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Selections
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [engine, setEngine] = useState<string>('');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolsApiResponse | null>(null);

  // Load vehicles and jobs once
  useEffect(() => {
    (async () => {
      try {
        const [vehRes, jobRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/jobs'),
        ]);
        if (vehRes.ok) setVehicles(await vehRes.json());
        if (jobRes.ok) setJobs(await jobRes.json());
      } catch (e) {
        console.error(e);
        setError('Failed to load initial data.');
      }
    })();
  }, []);

  // Dropdown options (derived)
  const years = useMemo(
    () => [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a),
    [vehicles]
  );

  const makes = useMemo(() => {
    if (!year) return [];
    return [...new Set(vehicles.filter(v => v.year.toString() === year).map(v => v.make))].sort();
  }, [vehicles, year]);

  const models = useMemo(() => {
    if (!year || !make) return [];
    return [...new Set(
      vehicles
        .filter(v => v.year.toString() === year && v.make === make)
        .map(v => v.model)
    )].sort();
  }, [vehicles, year, make]);

  const engines = useMemo(() => {
    if (!year || !make || !model) return [];
    return [...new Set(
      vehicles
        .filter(v => v.year.toString() === year && v.make === make && v.model === model)
        .map(v => v.engine)
    )];
  }, [vehicles, year, make, model]);

  // When engine changes, pick the matching vehicle id
  useEffect(() => {
    if (year && make && model && engine) {
      const match = vehicles.find(
        v =>
          v.year.toString() === year &&
          v.make === make &&
          v.model === model &&
          v.engine === engine
      );
      setSelectedVehicleId(match?.id ?? '');
    } else {
      setSelectedVehicleId('');
    }
  }, [year, make, model, engine, vehicles]);

  // Reset dependent selections
  useEffect(() => {
    setMake(''); 
    setModel(''); 
    setEngine('');
  }, [year]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    setModel(''); 
    setEngine('');
  }, [make]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    setEngine('');
  }, [model]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear results when selections change
  useEffect(() => {
    if (result) {
      setResult(null);
      setError(null);
    }
  }, [selectedVehicleId, selectedJobId, result]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!selectedVehicleId) {
      setError('Please select Year, Make, Model, and Engine.');
      return;
    }
    if (!selectedJobId) {
      setError('Please select a job.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: selectedVehicleId, jobId: selectedJobId }),
      });
      const data = (await res.json()) as ToolsApiResponse;

      if (!res.ok) {
        setError(data?.error || 'Request failed.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">RightTool — Find the Right Tools</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                disabled={!year}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Make</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!year || !make}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Model</option>
                {models.map(mo => <option key={mo} value={mo}>{mo}</option>)}
              </select>
            </div>

            {/* Engine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engine</label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                disabled={engines.length === 0}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Engine</option>
                {engines.map(en => <option key={en} value={en}>{en}</option>)}
              </select>
            </div>
          </div>

          {/* Job */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What job are you doing?</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Job</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading || !selectedVehicleId || !selectedJobId}
              className={`px-8 py-3 rounded-md font-semibold text-white transition-colors ${
                loading || !selectedVehicleId || !selectedJobId 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Searching...' : 'Find Tools'}
            </button>
          </div>
        </form>

        {/* Alert */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !error && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">
              Tools for {result.vehicle.year} {result.vehicle.make} {result.vehicle.model} ({result.vehicle.engine}) — {result.job.title}
            </h3>

            {result.tools.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-700">{result.message || 'No tools found for this combination.'}</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {result.tools.map((toolItem) => (
                  <div key={toolItem.requirementId} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{toolItem.tool.name}</h4>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          {toolItem.tool.brand && (
                            <span className="flex items-center">
                              <strong className="mr-1">Brand:</strong> {toolItem.tool.brand}
                            </span>
                          )}
                          {toolItem.tool.size && (
                            <span className="flex items-center">
                              <strong className="mr-1">Size:</strong> {toolItem.tool.size}
                            </span>
                          )}
                          {toolItem.tool.drive && (
                            <span className="flex items-center">
                              <strong className="mr-1">Drive:</strong> {toolItem.tool.drive}
                            </span>
                          )}
                          {toolItem.tool.spec && (
                            <span className="flex items-center">
                              <strong className="mr-1">Spec:</strong> {toolItem.tool.spec}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Quantity needed:</strong> {toolItem.qty}
                        </div>

                        {toolItem.notes && (
                          <div className="text-sm text-gray-700 italic mb-2">
                            <strong>Note:</strong> {toolItem.notes}
                          </div>
                        )}

                        {toolItem.tool.price && (
                          <div className="text-lg font-semibold text-green-600">
                            Approx. price: ${toolItem.tool.price}
                          </div>
                        )}
                      </div>

                      {toolItem.tool.buyUrl && (
                        <div className="lg:ml-4">
                          <a
                            href={toolItem.tool.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Buy / View
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}