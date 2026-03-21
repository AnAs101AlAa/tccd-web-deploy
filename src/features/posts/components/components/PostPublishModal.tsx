import { usePublishPost } from '@/shared/queries/posts';
import toast from 'react-hot-toast';
import ConfirmActionModal from '@/shared/components/modals/ConfirmActionModal';

interface PostPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  currentPublishStatus: boolean;
}

export default function PostPublishModal({
  isOpen,
  onClose,
  postId,
  currentPublishStatus,
}: PostPublishModalProps) {
  const { mutate: publishPost, isPending } = usePublishPost();

  const newPublishStatus = !currentPublishStatus;
  const action = newPublishStatus ? 'publish' : 'private';
  const actionCapitalized = newPublishStatus ? 'Publish' : 'Private';

  const handlePublish = () => {
    if (!postId) return;

    publishPost(
      { postId, isPosted: newPublishStatus },
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
      onConfirm={handlePublish}
      confirmButtonText={actionCapitalized}
      cancelButtonText="Cancel"
      isSubmitting={isPending}
    />
  );
}
