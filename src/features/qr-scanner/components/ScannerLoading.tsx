import { Loader2 } from "lucide-react";

const ScannerLoading = () => {
  return (
    <div className="aspect-square w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-center p-8 rounded-xl">
      <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Verifying QR Code
      </h3>
      <p className="text-gray-500">Please wait while we validate your scan...</p>
    </div>
  );
};

export default ScannerLoading;
