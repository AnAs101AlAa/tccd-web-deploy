import { Modal, Button } from 'tccd-ui';

export default function PostDeleteModal({isOpen, onClose, postId}: {isOpen: boolean; onClose: () => void; postId: string | null}) {
    const handleDelete = () => {
        //delete logic will be here when the time comes
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Post">
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-center gap-2">
                <Button type="secondary" onClick={onClose} buttonText="Cancel" width="small" />
                <Button type="danger" onClick={handleDelete} buttonText="Delete" width="small" />
            </div>
        </Modal>
    );
}