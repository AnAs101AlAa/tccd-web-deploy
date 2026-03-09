import { CheckCircle2 } from "lucide-react";

const ScannerSuccess = () => {
  return (
    <div className="aspect-square w-full flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100 text-center p-8 rounded-xl">
      <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Ticket Verified
      </h3>
      <p className="text-gray-500">
        Your ticket has been verified, enjoy the event!
      </p>
    </div>
  );
};

export default ScannerSuccess;
