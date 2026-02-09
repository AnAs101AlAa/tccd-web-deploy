import { Modal, Button } from 'tccd-ui';
import { useDeletePost } from '@/shared/queries/posts';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PostDeleteModal({isOpen, onClose, postId}: {isOpen: boolean; onClose: () => void; postId: string | null}) {
    const { mutate: deletePost, isPending } = useDeletePost();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        if (!postId) return;
        
        setError(null);
        deletePost(postId, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                toast.error('Failed to delete post. Please try again.');
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Post">
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            <div className="flex justify-center gap-2">
                <Button type="basic" onClick={onClose} buttonText="Cancel" width="small" disabled={isPending} />
                <Button type="danger" onClick={handleDelete} buttonText={isPending ? "Deleting..." : "Delete"} width="small" disabled={isPending} />
            </div>
        </Modal>
    );
}