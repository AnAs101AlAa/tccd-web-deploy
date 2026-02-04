import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import { XCircle } from "lucide-react";

interface ErrorFallbackProps {
  error: string;
  onReset: () => void;
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <div className="aspect-square w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 text-center p-8 rounded-xl border border-red-200">
      <div className="w-20 h-20 mb-6 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-red-700 mb-3">Scan Failed</h3>
      <p className="text-red-600 mb-6 max-w-md">{error}</p>
      <Button
        buttonText="Try Again"
        onClick={onReset}
        type={ButtonTypes.PRIMARY}
        width={ButtonWidths.AUTO}
      />
    </div>
  );
};

export default ErrorFallback;
