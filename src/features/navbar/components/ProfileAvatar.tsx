import profileImage from "@/assets/placeholders/profileImage.jpeg";
import { FiLogIn } from "react-icons/fi";
import Avatar from "@/shared/components/Avatar";

interface ProfileAvatarProps {
  isAuthenticated: boolean;
  onClick: () => void;
}

const ProfileAvatar = ({ isAuthenticated, onClick }: ProfileAvatarProps) => {
  return (
    <div data-profile-avatar>
      <Avatar
        src={isAuthenticated ? profileImage : undefined}
        alt="Profile"
        size="46px"
        backgroundColor="#ffffff"
        borderColor="#2A5F80"
        borderWidth="1px"
        showShadow
        shadowColor="rgba(0, 0, 0, 0.1)"
        onClick={onClick}
        fallback={
          <FiLogIn className="text-[#2A5F80] text-[20px] md:text-[28px]" />
        }
        className="w-[46px] sm:w-[53px] h-[46px] sm:h-[53px] md:w-[42px] md:h-[42px] xl:w-[44px] xl:h-[44px]"
      />
    </div>
  );
};

export default ProfileAvatar;
