import { Modal, Button, InputField } from "tccd-ui";
import { useState } from "react";

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
    const [confirmationText, setConfirmationText] = useState("");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Important Notice">
            <p className="text-contrast mb-4 mt-2 text-center text-[14px] md:text-[15px] lg:text-[16px]">
                Are you sure you want to register for this time slot? you will <strong>NOT be permitted</strong> entry on any different slots during the event.
            </p>
            <InputField
                labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
                id="confirm-registration"
                label="Please type 'CONFIRM' to proceed"
                placeholder="CONFIRM"
                onChange={(e) => setConfirmationText(e.target.value)}
                value={confirmationText}
            />

            <div className="flex justify-center space-x-2 mt-5">
                <Button type="basic" onClick={onClose} buttonText="Cancel" disabled={isSubmitting} />
                <Button type="primary" onClick={() => onConfirm()} buttonText="Confirm" loading={isSubmitting} disabled={isSubmitting || confirmationText !== "CONFIRM"} />
            </div>
        </Modal>
    );
}