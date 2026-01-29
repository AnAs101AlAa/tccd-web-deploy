import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Modal,
    InputField,
    NumberField,
    TextAreaField,
    Button,
    ButtonTypes,
    ButtonWidths,
} from "tccd-ui";
import { useCreateLocation } from "@/shared/queries/admin";
import {
    createLocationSchema,
    type CreateLocationFormData,
} from "@/features/admin/schemas";
import ImageUpload from "@/shared/components/ImageUpload";
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
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CreateLocationFormData>({
        resolver: zodResolver(createLocationSchema),
        defaultValues: {
            name: "",
            capacity: 0,
            image: "",
            address: "",
            description: "",
        },
    });

    const imageValue = watch("image");
    const descriptionValue = watch("description");

    const onSubmit = async (data: CreateLocationFormData) => {
        try {
            await createLocationMutation.mutateAsync({
                name: data.name.trim(),
                capacity: data.capacity,
                image: data.image,
                address: data.address?.trim() || undefined,
                description: data.description?.trim() || undefined,
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
            onClose={handleClose}
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
                                onChange={(val) => field.onChange(val || 0)}
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

                <ImageUpload
                    label="Location Image"
                    value={imageValue}
                    onChange={(base64) =>
                        setValue("image", base64, { shouldValidate: true })
                    }
                    error={errors.image?.message}
                />

                <div>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                label="Address (Optional)"
                                id="location-address"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="e.g., 123 Main Street, Downtown, Cairo"
                                error={errors.address?.message}
                            />
                        )}
                    />
                    {errors.address && (
                        <p className="text-red-600 text-sm mt-1" role="alert">
                            {errors.address.message}
                        </p>
                    )}
                </div>

                <div>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextAreaField
                                label="Description (Optional)"
                                id="location-description"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Brief description of the location..."
                                maxLength={500}
                                error={errors.description?.message}
                            />
                        )}
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm mt-1" role="alert">
                            {errors.description.message}
                        </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        {descriptionValue?.length || 0}/500 characters
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        buttonText="Cancel"
                        onClick={handleClose}
                        type={ButtonTypes.SECONDARY}
                        width={ButtonWidths.AUTO}
                        disabled={createLocationMutation.isPending}
                    />
                    <Button
                        buttonText="Submit"
                        type="primary"
                        onClick={() => handleSubmit}
                        width={ButtonWidths.AUTO}
                        disabled={createLocationMutation.isPending}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddLocationModal;
