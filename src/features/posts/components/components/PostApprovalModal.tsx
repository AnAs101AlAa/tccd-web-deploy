import { useApprovePost } from '@/shared/queries/posts';
import toast from 'react-hot-toast';
import ConfirmActionModal from '@/shared/components/modals/ConfirmActionModal';

interface PostApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  currentApprovalStatus: boolean;
}

export default function PostApprovalModal({
  isOpen,
  onClose,
  postId,
  currentApprovalStatus,
}: PostApprovalModalProps) {
  const { mutate: approvePost, isPending } = useApprovePost();

  const newApprovalStatus = !currentApprovalStatus;
  const action = newApprovalStatus ? 'publish' : 'private';
  const actionCapitalized = newApprovalStatus ? 'Publish' : 'Private';

  const handleApprove = () => {
    if (!postId) return;

    approvePost(
      { postId, isApproved: newApprovalStatus },
      {
        onSuccess: () => {
          toast.success(`Post ${action}d successfully!`);
          onClose();
        },
        onError: () => {
          toast.error(`Failed to ${action} post. Please try again.`);
        },
      }
    );
  };

  return (
    <ConfirmActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionCapitalized} Post`}
      message={`Are you sure you want to ${action} this post?${
        newApprovalStatus
          ? ' This will make the post visible to all users.'
          : ' This will hide the post from public view.'
      }`}
      onConfirm={handleApprove}
      confirmButtonText={actionCapitalized}
      cancelButtonText="Cancel"
      isSubmitting={isPending}
    />
  );
}
