import { Modal, Button } from "tccd-ui";
import type { Location } from "@/shared/queries/admin";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";
import { getErrorMessage } from "@/shared/utils";
import { useDeleteLocation } from "@/shared/queries/admin";

interface DeleteLocationConfirmationProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DeleteLocationConfirmation Component
 * Displays a confirmation dialog before deleting a location
 * Includes warning about permanent action
 */
const DeleteLocationConfirmation: React.FC<DeleteLocationConfirmationProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const deleteLocationMutation = useDeleteLocation();
  const handleDelete = async () => {
    try {
      await deleteLocationMutation.mutateAsync(location.id);
      toast.success(`${location.name} has been deleted successfully`);
      onClose();
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Delete Location"
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
            Are you sure you want to delete this location?
          </h3>
          <p className="text-gray-600">
            You are about to delete{" "}
            <span className="font-semibold text-gray-900">
              "{location.name}"
            </span>
            .
          </p>
          <p className="text-sm text-primary font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Location Details Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{location.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-medium text-gray-900">
              {location.capacity.toLocaleString()} people
            </span>
          </div>
        </div>

        {/* Additional Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Any events linked to this location may be
            affected. Please ensure this location is no longer in use before
            deleting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type="basic"
            width="auto"
            disabled={deleteLocationMutation.isPending}
          />
          <Button
            buttonText={deleteLocationMutation.isPending ? "Deleting..." : "Delete Location"}
            onClick={handleDelete}
            type="danger"
            width="auto"
            disabled={deleteLocationMutation.isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteLocationConfirmation;
