import { Modal, Button } from "tccd-ui";

export default function RegistrationConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Registration">
            <p className="text-contrast mb-4 text-center">Are you sure you want to register for this time slot? you will <strong>NOT be permitted</strong> entry on any different slots during the event.</p>
            <div className="flex justify-center space-x-2">
                <Button type="basic" onClick={onClose} buttonText="Cancel" disabled={isSubmitting} />
                <Button type="primary" onClick={() => onConfirm()} buttonText="Confirm" loading={isSubmitting} disabled={isSubmitting} />
            </div>
        </Modal>
    );
}