import { NAV_ITEMS } from "@/constants/NavItems";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileMenu from "./components/ProfileMenu";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isAuthenticated = true;

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      setShowProfile(true);
      if (!showProfileMenu) {
        setShowProfileMenu(true);
      } else {
        setShowProfileMenu(false);
      }
    }
  };

  return (
    <nav className="w-full bg-white relative flex justify-between items-center px-[6%] h-16 border border-[#000]/13 rounded-t-3xl">
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
      
      <div className="absolute left-1/2 -translate-x-1/2 -top-7">
        <ProfileAvatar
          isAuthenticated={isAuthenticated}
          showProfile={showProfile}
          onClick={handleAvatarClick}
        />

        <ProfileMenu
          isOpen={showProfileMenu}
          onClose={() => {
            setShowProfileMenu(false);
          }}
        />
      </div>
    </nav>
  );
};

export default MobileNavbar;
