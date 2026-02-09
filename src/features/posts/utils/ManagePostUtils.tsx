import type { CommunityPost, PostMedia } from "@/shared/types";
import { useEffect, useState } from "react";
import { useCreatePost, useAddPostMedia, useUpdatePost, useDeletePostMedia } from "@/shared/queries/posts";
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
    const [newMedia, setNewMedia] = useState<PostMedia[]>([]);
    const [originalMedia, setOriginalMedia] = useState<PostMedia[]>(initialData?.media || []);
    const [deletedMedia, setDeletedMedia] = useState<PostMedia[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const createPostMutation = useCreatePost();
    const addPostMediaMutation = useAddPostMedia();
    const updatePostMutation = useUpdatePost();
    const deletePostMediaMutation = useDeletePostMedia();

    useEffect(() => {
        if(initialData) {
            setPostData(initialData);
            setOriginalMedia(initialData.media || []);
            setNewMedia([]);
            setDeletedMedia([]);
        }
    }, [initialData]);

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

    const handleRemoveOriginalMedia = (media: PostMedia) => {
        const mediaToDelete = originalMedia.find(m => m.id === media.id);
        if (mediaToDelete) {
            setDeletedMedia((prev) => [...prev, mediaToDelete]);
        }
    };

    const handleRemoveNewMedia = (media: PostMedia) => {
        setNewMedia((prev) => prev.filter((m) => m.id !== media.id));
    };

    const handleAddNewMedia = () => {
        if (currentMediaInput.trim()) {
            const extractedId = extractDriveId(currentMediaInput.trim());
            setNewMedia((prev) => [...prev, { id: "", mediaUrl: extractedId }]);
            setCurrentMediaInput("");
        }
    };

    const handleAddMedia = (mediaId: string) => {
        const extractedId = extractDriveId(mediaId);

        if (currentMediaInput.trim()) {
            setNewMedia((prev) => [...prev, { id: "", mediaUrl: extractedId }]);
            setCurrentMediaInput("");
        }
    };

    const validatePost = (): boolean => {
        setErrors({});
        
        try {
            const formData = {
                name: postData?.name || "",
                description: postData?.description || "",
                media: [...originalMedia.filter((media) => !deletedMedia.includes(media)), ...newMedia],
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
        if (!validatePost()) {
            return;
        }

        if(initialData.id === "") {
            try {
                const res = await createPostMutation.mutateAsync({
                    name: postData?.name || "",
                    description: postData?.description || "",
                    priority: 100,
                });

                await addPostMediaMutation.mutateAsync({
                    postId: res.id,
                    mediaFiles: newMedia.map((media) => media.mediaUrl),
                });

                toast.success("Post created successfully!");
                onClose();
            } catch {
                toast.error("An unexpected error occurred while creating the post, please try again.");
            }
        } else {
            try {
                await updatePostMutation.mutateAsync({
                    postId: postData.id,
                    postData: {
                        name: postData.name,
                        description: postData.description,
                        priority: postData.priority,
                    }
                });

                if (newMedia.length > 0) {
                    await addPostMediaMutation.mutateAsync({
                        postId: postData.id,
                        mediaFiles: newMedia.map((media) => media.mediaUrl),
                    });
                }

                if (deletedMedia.length > 0) {
                    await deletePostMediaMutation.mutateAsync({
                        postId: postData.id,
                        mediaFiles: deletedMedia.map((media) => extractDriveId(media.id)),
                    });
                }

                toast.success("Post updated successfully!");
                onClose();
            } catch {
                toast.error("An unexpected error occurred while updating the post, please try again.");
            }
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
        newMedia,
        originalMedia,
        deletedMedia,
        isAddingMedia,
        currentMediaInput,
        setCurrentMediaInput,
        handleAddMedia,
        handleAddNewMedia,
        handleRemoveNewMedia,
        handleRemoveOriginalMedia,
        isSubmitting: createPostMutation.isPending || addPostMediaMutation.isPending || updatePostMutation.isPending || deletePostMediaMutation.isPending,
        errors,
        validatePost,
        handleSubmit,
        clearErrors,
    };
}