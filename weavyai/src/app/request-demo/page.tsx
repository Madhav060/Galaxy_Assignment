export default function RequestDemoPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-10">
      <h1 className="text-2xl font-bold mb-6">Book a Demo</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}