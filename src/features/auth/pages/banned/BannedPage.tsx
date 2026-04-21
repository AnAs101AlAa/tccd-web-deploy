import { Link } from "react-router-dom";
// import { ShieldAlert, Mail, ArrowLeft } from "lucide-react";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const BannedPage = () => {
  return (
    <main className="min-h-screen relative flex items-center justify-center bg-linear-to-b from-[#fdfbf7] to-[#F8F6F1] overflow-hidden p-4 sm:p-8">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-100/40 via-transparent to-transparent pointer-events-none" />

      <section
        className="w-full max-w-md relative z-10"
        aria-labelledby="banned-title"
      >
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(220,38,38,0.2)] backdrop-blur-xl text-center">
          <header className="flex flex-col items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-3 rounded-full bg-red-100/50 opacity-100 animate-pulse transition-opacity duration-500" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border border-red-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                <ShieldAlert className="h-10 w-10 text-red-500" strokeWidth={1.75} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 id="banned-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Action Required
              </h1>
              <p className="text-gray-500 font-medium">
                Your account access has been temporarily banned.
              </p>
            </div>
          </header>

          <div className="space-y-6 mt-8">
            {/* <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 text-left relative overflow-hidden group hover:border-red-100 transition-colors duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-2xl opacity-80" />
              <div className="pl-2">
                <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-red-500" /> Contact Support Team
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  If you believe this restriction was a mistake or need further details, our support team is ready to assist you.
                </p>
                
                <a
                  href="mailto:support@tccd-cufe.com"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  Email Support
                </a>
              </div>
            </div> */}

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
