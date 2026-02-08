import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  InputField,
  NumberField,
  Button,
  ButtonTypes,
  ButtonWidths,
} from "tccd-ui";
import { useUpdateLocation } from "@/shared/queries/admin";
import type { Location } from "@/shared/queries/admin";
import {
  editLocationSchema,
  type EditLocationFormData,
} from "@/features/admin/schemas";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";

interface EditLocationModalProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EditLocationModal Component
 * Provides a form to edit location details
 * Uses Zod for validation and react-hook-form for form management
 */
const EditLocationModal: React.FC<EditLocationModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const updateLocationMutation = useUpdateLocation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditLocationFormData>({
    resolver: zodResolver(editLocationSchema),
    defaultValues: {
      name: location.name,
      capacity: location.capacity,
    },
  });

  // Reset form when location changes
  useEffect(() => {
    reset({
      name: location.name,
      capacity: location.capacity,
    });
  }, [location, reset]);

  const onSubmit = async (data: EditLocationFormData) => {
    try {
      await updateLocationMutation.mutateAsync({
        id: location.id,
        payload: {
          id: location.id,
          name: data.name.trim(),
          capacity: data.capacity,
        },
      });

      toast.success("Location updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Edit Location"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Location Name */}
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                label="Location Name"
                id="location-name"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g., Grand Conference Hall"
                error={errors.name?.message}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <NumberField
                label="Capacity"
                value={field.value?.toString() || ""}
                onChange={(val: string | number) =>
                  field.onChange(parseInt(val.toString(), 10) || 0)
                }
                placeholder="e.g., 500"
                error={errors.capacity?.message}
              />
            )}
          />
          {errors.capacity && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {errors.capacity.message}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 text-sm">
          <strong>Note:</strong> Only name and capacity can be updated.
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.AUTO}
            disabled={updateLocationMutation.isPending}
          />
          <button
            type="submit"
            disabled={updateLocationMutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateLocationMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLocationModal;
