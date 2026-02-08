import { Modal, Button } from "tccd-ui";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";
import { getErrorMessage } from "@/shared/utils";
import type Event from "@/shared/types/events";
import { useDeleteEvent } from "@/shared/queries/admin/events/eventsQueries";

interface DeleteEventConfirmationProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteEventConfirmation: React.FC<DeleteEventConfirmationProps> = ({
  event,
  isOpen,
  onClose,
}) => {
    const deleteEventMutation = useDeleteEvent();

  const handleDelete = async () => {
    try {
      await deleteEventMutation.mutateAsync(event.id);
      toast.success(`${event.name} has been deleted successfully`);
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Delete Event"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md"
    >
      <div className="space-y-5">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FaExclamationTriangle className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Are you sure you want to delete this event?
          </h3>
          <p className="text-gray-600">
            You are about to delete{" "}
            <span className="font-semibold text-gray-900">
              "{event.name}"
            </span>
            .
          </p>
          <p className="text-sm text-primary font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type="basic"
            width="auto"
            disabled={deleteEventMutation.isPending}
          />
          <Button
            buttonText={deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
            onClick={handleDelete}
            type="danger"
            width="auto"
            disabled={deleteEventMutation.isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEventConfirmation;
