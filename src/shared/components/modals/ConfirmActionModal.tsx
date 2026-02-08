import { Modal, Button } from "tccd-ui";

export default function ConfirmActionModal({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    isSubmitting = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isSubmitting?: boolean;
}) {
    return (
        <Modal isOpen={isOpen} onClose={() => {if(!isSubmitting) onClose()}} title={title}>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-contrast mb-4">{message}</p>
            <div className="flex justify-center gap-3">
                <Button type="basic" onClick={onClose} buttonText={cancelButtonText} disabled={isSubmitting} />
                <Button type="primary" onClick={onConfirm} buttonText={confirmButtonText} loading={isSubmitting} disabled={isSubmitting} />
            </div>
        </Modal>
    )
}