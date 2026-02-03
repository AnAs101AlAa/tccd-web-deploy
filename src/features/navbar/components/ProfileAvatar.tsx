import { FiLogIn } from "react-icons/fi";
import Avatar from "@/shared/components/Avatar";
import type { User } from "@/shared/types";

interface ProfileAvatarProps {
  userData: User;
  isAuthenticated: boolean;
  onClick: () => void;
}

const ProfileAvatar = ({ userData, isAuthenticated, onClick }: ProfileAvatarProps) => {
  console.log("User Data in ProfileAvatar:", userData);

  return (
    <div data-profile-avatar>
      <Avatar
        src={isAuthenticated ? userData.profilePicture || '/user.jpg' : undefined}
        alt="Profile"
        size="42px"
        backgroundColor="#ffffff"
        borderColor="#2A5F80"
        borderWidth="1px"
        showShadow
        shadowColor="rgba(0, 0, 0, 0.1)"
        onClick={onClick}
        fallback={
          <FiLogIn className="text-[#2A5F80] text-[20px] md:text-[28px]" />
        }
        className="w-[42px] sm:w-[49px] h-[42px] sm:h-[49px] md:w-[42px] md:h-[42px] xl:w-[44px] xl:h-[44px]"
      />
    </div>
  );
};

export default ProfileAvatar;
