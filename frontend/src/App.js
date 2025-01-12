import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { HomeIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

function App() {
  const [data, setData] = useState({
    location: [],
  });
  const [formData, setFormData] = useState({
    location: "",
    total_sqft: "",
    bath: "",
    bhk: "",
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/location-data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictedPrice(data.predicted_price);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error during prediction:", error);
      });
  };

  return (
    <div className="bg-gradient-to-br from-green-400 to-blue-300 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <HomeIcon className="h-10 w-10 text-green-500" />
            Bangalore House Price Predictor
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Fill in the details below to predict the price of your dream house.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-700 text-lg font-medium">
                Choose a Location
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-2.5 h-6 w-6 text-gray-400" />
                <select
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select a location
                  </option>
                  {data.location.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-lg font-medium">
                Total Square Feet
              </label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500"
                type="text"
                name="total_sqft"
                placeholder="Enter square feet"
                value={formData.total_sqft}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-lg font-medium">
                Number of Bathrooms
              </label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500"
                type="text"
                name="bath"
                placeholder="Enter number of bathrooms"
                value={formData.bath}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-lg font-medium">
                Number of Bedrooms (BHK)
              </label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500"
                type="text"
                name="bhk"
                placeholder="Enter number of BHK"
                value={formData.bhk}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
          >
            Predict Price
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            as={motion.div}
            static
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Predicted Price
                </h2>
                <p className="text-4xl font-semibold text-green-500">
                  ₹{predictedPrice}cr
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
