import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EventRegisterApi } from "@/shared/queries/events/eventRegisterApi";

const api = new EventRegisterApi();

const DataDisplayCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm sm:text-base font-medium text-[#CD3A38]">{label}</span>
    <span className="text-sm sm:text-base font-semibold text-[#295E7E] text-right dir-ltr break-words max-w-[60%] sm:max-w-[70%]">{value}</span>
  </div>
);

const EventRegistrationPage: React.FC = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCurrentUser().then(setUserData);
  }, []);

  const handleRegister = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      await api.registerForEvent(eventName!, userData);
      alert("Registration successful!");
    } catch {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => window.history.back();

  if (!userData)
    return <div className="min-h-screen flex justify-center items-center">Loading user data...</div>;

  const displayFields = [
    { label: "Full Name (Arabic)", value: userData.fullNameArabic },
    { label: "Full Name (English)", value: userData.fullNameEnglish },
    { label: "Email Address", value: userData.email },
    { label: "Phone Number", value: userData.phoneNumber },
    { label: "University", value: userData.university },
    { label: "Faculty", value: userData.faculty },
    ...(userData.department ? [{ label: "Department", value: userData.department }] : []),
    { label: "Graduation Year", value: userData.gradYear },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-lg rounded-xl p-5 sm:p-6 md:p-8">
        <header className="mb-5 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-2 text-[#CD3A38]">
            {eventName} Registration
          </h1>
          <p className="text-sm sm:text-base text-[#295E7E] leading-relaxed">
            Please make sure all data are correct before confirming. <br />
            You won’t be able to edit them afterward.
          </p>
        </header>

        <div className="border border-gray-200 rounded-lg p-4 sm:p-5 mb-6 bg-white">
          <h2 className="text-base sm:text-lg font-bold mb-3 border-b pb-2 text-[#CD3A38]">
            Your Registered Data
          </h2>
          {displayFields.map((field, index) => (
            <DataDisplayCard key={index} label={field.label} value={field.value} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 items-center">
          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded-md font-semibold text-sm sm:text-base transition duration-150 shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-95"
            }`}
            style={{ backgroundColor: "#CD3A38", borderColor: "#CD3A38" }}
          >
            {loading ? "Registering..." : "Confirm Registration"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 border rounded-md font-semibold text-sm sm:text-base transition duration-150 cursor-pointer hover:bg-gray-100"
            style={{ borderColor: "#295E7E", color: "#295E7E" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
