import {
  QRCodeScanner,
  ErrorFallback,
  ScannerLoading,
  UserInfoCard,
} from "../components";
import { useQRScanner } from "../hooks";
import { QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";

export const QRScannerPage = () => {
  const navigate = useNavigate();
  const {
    isScanning,
    isVerifying,
    scanResult,
    error,
    handleScan,
    handleScanError,
    reset,
  } = useQRScanner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center flex flex-col gap-2 items-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <QrCode className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              QR Code Scanner
            </h1>
            <p className="text-gray-600">
              Scan an event QR code to verify attendance
            </p>
            <Button
              buttonText="Back"
              buttonIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
              type={ButtonTypes.SECONDARY}
              width={ButtonWidths.FIT}
            />
          </div>
        </header>

        {/* Scanner Container */}
        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Scanning State */}
          {isScanning && !error && !scanResult && !isVerifying && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <QRCodeScanner onScan={handleScan} onError={handleScanError} />
            </div>
          )}

          {/* Verifying State */}
          {isVerifying && <ScannerLoading />}

          {/* Error State */}
          {error && !scanResult && (
            <ErrorFallback error={error.message} onReset={reset} />
          )}

          {/* Success State */}
          {scanResult && (
            <UserInfoCard scanResult={scanResult} onClose={reset} />
          )}
        </main>
      </div>
    </div>
  );
};
