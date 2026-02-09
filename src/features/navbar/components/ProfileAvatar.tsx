import { FiLogIn } from "react-icons/fi";
import Avatar from "@/shared/components/Avatar";

interface ProfileAvatarProps {
  onClick: () => void;
}

const ProfileAvatar = ({ onClick }: ProfileAvatarProps) => {

  return (
    <div data-profile-avatar>
      <Avatar
        src={'/user.jpg'}
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
