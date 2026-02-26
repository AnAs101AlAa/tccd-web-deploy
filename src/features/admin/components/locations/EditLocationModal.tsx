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
import extractGoogleDriveId from "@/shared/utils/googleDriveHelper";

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
      roomImageFileId: extractGoogleDriveId(location.roomImage),
    }
  });

  // Reset form when location changes
  useEffect(() => {
    reset({
      name: location.name,
      capacity: location.capacity,
      roomImageFileId: extractGoogleDriveId(location.roomImage),
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
          roomImageFileId: data.roomImageFileId,
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

        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <NumberField
              id="location-capacity"
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

        <Controller
          name="roomImageFileId"
          control={control}
          render={({ field }) => (
            <InputField
              label="Google Drive Image ID"
              id="location-image"
              value={field.value}
              onChange={(e: any) => {
                const val =
                  e?.target?.value !== undefined ? e.target.value : e;
                const match =
                  typeof val === "string"
                    ? val.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                      val.match(/id=([a-zA-Z0-9_-]+)/)
                    : null;
                const id = match ? match[1] : val;
                field.onChange(id);
              }}
              placeholder="Paste ID or full Google Drive URL"
              error={errors.roomImageFileId?.message}
            />
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.AUTO}
            disabled={updateLocationMutation.isPending}
          />
          <Button
            type="primary"
            disabled={updateLocationMutation.isPending}
            buttonText={updateLocationMutation.isPending ? "Saving..." : "Save Changes"}
            onClick={handleSubmit(onSubmit)}
            
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditLocationModal;
