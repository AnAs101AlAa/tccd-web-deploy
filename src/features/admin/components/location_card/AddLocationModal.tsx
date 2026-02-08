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
import { useCreateLocation } from "@/shared/queries/admin";
import {
  createLocationSchema,
  type CreateLocationFormData,
} from "@/features/admin/schemas";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createLocationMutation = useCreateLocation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLocationFormData>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      roomImageFileId: "",
    },
  });

  const onSubmit = async (data: CreateLocationFormData) => {
    try {
      await createLocationMutation.mutateAsync({
        name: data.name.trim(),
        capacity: data.capacity,
        roomImageFileId: data.roomImageFileId,
      });

      toast.success("Location created successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add New Location"
      isOpen={isOpen}
      onClose={() => {if(!createLocationMutation.isPending) handleClose()}}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div>
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <NumberField
                label="Capacity"
                value={field.value?.toString() || ""}
                onChange={(val: string | number) => field.onChange(val || 0)}
                placeholder="e.g., 500"
                error={errors.capacity?.message}
              />
            )}
          />
        </div>

        <div>
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
                  // Regex to extract ID from Google Drive URL
                  // Matches /d/ID or id=ID
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
          {errors.roomImageFileId && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {errors.roomImageFileId.message}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
          <Button
            buttonText="Cancel"
            onClick={handleClose}
            type="basic"
            width="auto"
            disabled={createLocationMutation.isPending}
          />
          <Button
            buttonText="Submit"
            type="primary"
            onClick={() => handleSubmit(onSubmit)()}
            width="auto"
            loading={createLocationMutation.isPending}
            disabled={createLocationMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddLocationModal;
