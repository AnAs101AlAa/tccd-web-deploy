import profileImage from "@/assets/placeholders/profileImage.jpeg";
import { FiLogIn } from "react-icons/fi";

interface ProfileAvatarProps {
  isAuthenticated: boolean;
  onClick: () => void;
}

const ProfileAvatar = ({ isAuthenticated, onClick }: ProfileAvatarProps) => {
  return (
    <div className="cursor-pointer" onClick={onClick} data-profile-avatar>
      <div className="relative">
        <div
          aria-hidden
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-14 rounded-full bg-black/10 blur-md"
        />
        <div className="rounded-full w-[60px] h-[60px] bg-white border border-[#2A5F80] shadow-[6px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center">
          {!isAuthenticated ? (
            <div className="flex items-center justify-center w-full h-full">
              <FiLogIn size={28} className="text-[#2A5F80]" />
            </div>
          ) : (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;
