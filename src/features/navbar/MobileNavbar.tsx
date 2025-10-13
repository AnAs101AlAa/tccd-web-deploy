import { NAV_ITEMS } from "@/constants/NavItems";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "@/assets/TCCD_logo.svg";
// import { TbLogout2 } from "react-icons/tb";
// import { useState } from "react";
// import LogoutModal from "./LogoutModal";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  //   const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <nav className="w-full bg-white relative flex justify-between items-center px-[6%] h-16 border border-[#000]/13 rounded-t-3xl">
      {/* <LogoutModal
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      /> */}
      {NAV_ITEMS.map(({ icon: Icon, to, title }, index) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            className={`${
              active ? "text-primary" : "text-secondary"
            } inline-flex flex-col items-center gap-1 ${
              index === 1 ? "mr-7" : index === 2 ? "ml-7" : ""
            } cursor-pointer`}
            key={title}
            to={to}
          >
            <Icon size={22} />
            <span
              className={`${
                active ? "text-muted-primary" : "text-muted-secondary"
              } text-xs`}
            >
              {title}
            </span>
          </Link>
        );
      })}
      {/* <div
        className="inline-flex flex-col items-center gap-1 cursor-pointer group"
        onClick={() => setShowLogoutModal(true)}
      >
        <TbLogout2
          size={22}
          className="text-secondary group-hover:text-primary transition-colors duration-200"
        />
        <span className="text-xs text-muted-secondary">Logout</span>
      </div> */}

      <div className="absolute left-1/2 -translate-x-1/2 -top-7">
        <div className="relative">
          {/* soft pedestal shadow */}
          <div
            aria-hidden
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-14 rounded-full bg-black/10 blur-md"
          />
          {/* badge - outer circle with border and shadow */}
          <div className="rounded-full w-[60px] h-[60px] bg-white border border-[#2A5F80] shadow-[6px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
            {/* Frame 2 - inner circle with drop shadow */}
            <div
              className="rounded-full w-[41px] h-[39px] border border-[#F2F2F2] flex items-center justify-center"
              style={{ filter: "drop-shadow(8px 4px 4px rgba(0, 0, 0, 0.3))" }}
            >
              <img src={logo} alt="TCCD" className="block h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
