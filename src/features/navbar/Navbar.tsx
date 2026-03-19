import { NAV_ITEMS } from "@/constants/NavItems";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileMenu from "./components/ProfileMenu";
import facultyLogo from "@/assets/faculty.png";
import universityLogo from "@/assets/university.png";
import { useAppSelector } from "@/shared/store/hooks";
import { selectIsAuthenticated } from "@/shared/store/selectors/userSelectors";
import AIImage from "@/assets/AIImage.jpeg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav className="relative w-full bg-background h-[70px] shadow-lg">
      <div className="w-[94%] xl:w-[90%] flex items-center h-full mx-auto relative">
        {/* Logos - Left */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img
            src={universityLogo}
            alt="University"
            className="h-[46px] xl:h-[50px] w-auto"
          />
          <img
            src={facultyLogo}
            alt="Faculty"
            className="h-[44px] xl:h-[47px] w-auto"
          />
        </div>
        
        {/* Center Navigation - Absolute Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 xl:gap-6">
          {NAV_ITEMS.slice(0, Math.ceil(NAV_ITEMS.length / 2)).map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
          key={title}
          to={to}
          className={`font-bold text-[15px] xl:text-[17px] leading-7 whitespace-nowrap ${
            active ? "text-primary" : "text-secondary"
          } hover:opacity-80 transition-opacity`}
              >
          {title}
              </Link>
            );
          })}
          <img src="https://res.cloudinary.com/do0yekzmf/image/upload/v1772147018/TCCD_logo_ucw7ki.svg" alt="TCCD" className="h-[28px] xl:h-[26px] w-auto" />
          {NAV_ITEMS.slice(Math.ceil(NAV_ITEMS.length / 2)).map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
          key={title}
          to={to}
          className={`font-bold text-[15px] xl:text-[17px] leading-7 whitespace-nowrap ${
            active ? "text-primary" : "text-secondary"
          } hover:opacity-80 transition-opacity`}
              >
          {title}
              </Link>
            );
          })}
        </div>

        {/* Right Side - AI Button & Profile */}
        <div className="ml-auto flex gap-4 items-center shrink-0">
          {isAuthenticated ? (
            <>
              <div className="bg-slate-100 border border-gray-200 shadow-md rounded-full p-1 pr-4 flex items-center gap-2 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/owra-chat")}>
                <div className="rounded-full flex items-center justify-center bg-linear-to-br from-primary to-secondary p-0.5">
                  <img src={AIImage} alt="AI" className="h-6.5 xl:h-7.5 w-auto rounded-full" />
                </div>
                <p className="gradient-text font-semibold text-[15px]">ASK AI</p>
              </div>
              <div className="relative">
                <ProfileAvatar
                  onClick={handleAvatarClick}
                />
                <ProfileMenu
                  isOpen={showProfileMenu}
                  onClose={() => {
                    setShowProfileMenu(false);
                  }}
                  isAuthenticated={isAuthenticated}
                  position="bottom"
                />
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="font-poppins font-semibold text-base text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
