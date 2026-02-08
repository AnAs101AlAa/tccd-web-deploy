import type { CommunityPost } from "@/shared/types";
import { useState } from "react";
import { useCreatePost, useAddPostMedia } from "@/shared/queries/posts";
import { z, ZodError } from "zod";
import toast from "react-hot-toast";
import extractDriveId from "@/shared/utils/googleDriveHelper";

export const postSchema = z.object({
    name: z.string().min(1, "Title is required and cannot be empty"),
    description: z.string().min(1, "Description is required and cannot be empty"),
    media: z.array(z.any()).min(1, "At least one media file is required"),
});

export type PostFormData = z.infer<typeof postSchema>;

export default function useManagePostUtils({initialData, onClose}: {initialData: CommunityPost, onClose: () => void}) {
    const [postData, setPostData] = useState<CommunityPost>(initialData);
    const [isAddingMedia, setIsAddingMedia] = useState<boolean>(false);
    const [currentMediaInput, setCurrentMediaInput] = useState<string>("");
    const [newMediaIds, setNewMediaIds] = useState<string[]>([]);
    const [originalMedia] = useState<string[]>([]);
    const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const createPostMutation = useCreatePost();
    const addPostMediaMutation = useAddPostMedia();

    const handleInputChange = (field: keyof CommunityPost, value: string | number | boolean) => {
        setPostData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleRemoveOriginalMedia = (mediaId: string) => {
        setDeletedMediaIds((prev) => [...prev, mediaId]);
    };

    const handleRemoveNewMedia = (mediaId: string) => {
        setNewMediaIds((prev) => prev.filter((id) => id !== mediaId));
    };

    const handleAddNewMedia = () => {
        if (currentMediaInput.trim()) {
            const extractedId = extractDriveId(currentMediaInput.trim());
            setNewMediaIds((prev) => [...prev, extractedId]);
            setCurrentMediaInput("");
        }
    };

    const handleAddMedia = (mediaId: string) => {
        const extractedId = extractDriveId(mediaId);

        if (currentMediaInput.trim()) {
            setNewMediaIds((prev) => [...prev, extractedId]);
            setCurrentMediaInput("");
        }
    };

    const validatePost = (): boolean => {
        setErrors({});
        
        try {
            const formData = {
                name: postData?.name || "",
                description: postData?.description || "",
                media: [...originalMedia.filter((id) => !deletedMediaIds.includes(id)), ...newMediaIds],
            };

            postSchema.parse(formData);
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        fieldErrors[issue.path[0] as string] = issue.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error("Please fix the errors before submitting");
            }
            return false;
        }
    };

    const handleSubmit = async () => {

        setIsSubmitting(true);

        try {
            if (!validatePost()) {
                setIsSubmitting(false);
                return;
            }

            const res = await createPostMutation.mutateAsync({
                name: postData?.name || "",
                description: postData?.description || "",
                priority: 100,
            });

            await addPostMediaMutation.mutateAsync({
                postId: res.id,
                mediaFiles: newMediaIds,
            });

            toast.success("Post created successfully!");
            onClose();
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear errors function
    const clearErrors = () => {
        setErrors({});
    };

    return {
        postData,
        handleInputChange,
        setIsAddingMedia,
        newMediaIds,
        originalMedia,
        deletedMediaIds,
        isAddingMedia,
        currentMediaInput,
        setCurrentMediaInput,
        handleAddMedia,
        handleAddNewMedia,
        handleRemoveNewMedia,
        handleRemoveOriginalMedia,
        isSubmitting,
        errors,
        validatePost,
        handleSubmit,
        clearErrors,
    };
}