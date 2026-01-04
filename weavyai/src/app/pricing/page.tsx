export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-10">Simple Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example Pricing Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Starter</h3>
          <p className="text-3xl font-bold my-4">$0</p>
          <p className="text-gray-500">For individuals.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border border-blue-200">
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="text-3xl font-bold my-4">$29</p>
          <p className="text-gray-500">For small teams.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Enterprise</h3>
          <p className="text-3xl font-bold my-4">Custom</p>
          <p className="text-gray-500">For large organizations.</p>
        </div>
      </div>
    </div>
  );
}