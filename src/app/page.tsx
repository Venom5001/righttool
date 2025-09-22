import VehicleSelector from '../components/VehicleSelector'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to RightTool
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the exact automotive tools for any job
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="mb-12">
          <VehicleSelector />
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Find Tools</h2>
            <p className="text-gray-600">
              Search for tools based on your vehicle and the job you need to do
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Save Favorites</h2>
            <p className="text-gray-600">
              Build your personal toolbox with tools you own or want to buy
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Get Links</h2>
            <p className="text-gray-600">
              Direct links to purchase tools from trusted vendors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}