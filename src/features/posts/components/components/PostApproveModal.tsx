import { useApprovePost } from '@/shared/queries/posts';
import toast from 'react-hot-toast';
import ConfirmActionModal from '@/shared/components/modals/ConfirmActionModal';

interface PostApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  currentApprovalStatus: boolean;
}

export default function PostPublishModal({
  isOpen,
  onClose,
  postId,
  currentApprovalStatus,
}: PostApprovalModalProps) {
  const { mutate: approvePost, isPending } = useApprovePost();

  const newPublishStatus = !currentApprovalStatus;
  const action = newPublishStatus ? 'approve' : 'unapprove';
  const actionCapitalized = newPublishStatus ? 'Approve' : 'Unapprove';

  const handleApprove = () => {
    if (!postId) return;

    approvePost(
      { postId, isApproved: newPublishStatus },
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
        newPublishStatus
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
