"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [activityData, setActivityData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [clickedArea, setClickedArea] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/customer-activity');
        const { data, insights } = await response.json();

        // Group data by area
        const groupedData = data.reduce((acc, entry) => {
          if (!acc[entry.area]) {
            acc[entry.area] = [];
          }
          acc[entry.area].push(entry);
          return acc;
        }, {});

        setActivityData(groupedData);
        setInsights(insights);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleAreaClick = (area) => {
    setClickedArea(area); //show the modal
  };

  const closeModal = () => {
    setClickedArea(null); // Close the modal
  };

  return (
    <div className="p-4 max-w-[90vw] m-auto">
      <h1 className="text-2xl sm:text-5xl my-10 flex justify-center font-bold mb-4">
        Customer Activity Dashboard
      </h1>

      {insights && (
        <div className="my-10 sm:text-xl font-bold">
          <p className="my-2 text-green-500">
            Most Active Area: {insights.mostActiveArea.area} ({insights.mostActiveArea.activity} activities)
          </p>
          <p className="my-2 text-red-600">
            Least Active Area: {insights.leastActiveArea.area} ({insights.leastActiveArea.activity} activities)
          </p>
          <p className="my-2 text-yellow-500">
            Peak Activity Time: {new Date(insights.peakActivityTime.time).toLocaleString()} at {insights.peakActivityTime.area} ({insights.peakActivityTime.activity} activities)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(activityData).map((area, index) => (
          <div
            key={index}
            className="bg-white text-black p-6 text-center rounded shadow-lg hover:scale-105 duration-300 cursor-pointer relative"
            onClick={() => handleAreaClick(area)} 
          >
            <h2 className="font-semibold text-xl">{area}</h2>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {clickedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white relative  text-black py-10 px-6 rounded shadow-lg max-w-[90vw]">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl">{clickedArea} Activity Details</h3>
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 hover:scale-110 duration-300 font-semibold"
              >
                X
              </button>
            </div>
            <div className="mt-4">
              {activityData[clickedArea].map((item, idx) => (
                <p key={idx}>
                  <strong>Time:</strong> {new Date(item.time).toLocaleString()} - <strong>Activity:</strong> {item.activity}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
