import { Button, Modal, InputField } from "tccd-ui";
import { FaPlus, FaCheck } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import useManagePostUtils from "../../utils/ManagePostUtils";
import type { CommunityPost, PostMedia } from "@/shared/types";
import extractDriveId from "@/shared/utils/googleDriveHelper";
import { RichTextEditor } from "@/shared/components/RichTextEditor";

export default function ManagePostModal({
  initialData = {
    id: "",
    name: "",
    description: "",
    media: [],
    priority: 0,
    isApproved: false,
    createdAt: new Date().toISOString(),
  },
  isOpen,
  onClose,
}: {
  initialData?: CommunityPost;
  isOpen: boolean;
  onClose: () => void;
}) {

  const {
    postData,
    isAddingMedia,
    currentMediaInput,
    setCurrentMediaInput,
    handleInputChange,
    newMedia,
    originalMedia,
    deletedMedia,
    handleRemoveNewMedia,
    setIsAddingMedia,
    handleAddMedia,
    handleRemoveOriginalMedia,
    isSubmitting,
    errors,
    handleSubmit,
  } = useManagePostUtils({initialData: initialData, onClose});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData.id !== "" ? "Edit Post" : "Create a new Post"}>
      <div className="space-y-4">
        <InputField
          id="post-title-field"
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600"
          label="Post Title"
          value={postData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter post title"
          error={errors.name}
        />
        
        <RichTextEditor
          id="post-description-field"
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600"
          label="Post Description"
          placeholder="What's new?"
          value={postData.description}
          onChange={(value) => handleInputChange("description", value)}
          maxLength={2000}
          error={errors.description}
          errorClassName="-mt-1"
        />

        <div className="space-y-3">
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600">
                Media drive file IDs
              </p>
              <Button
                buttonIcon={<FaPlus className="size-3" />}
                className="py-1 md:py-2 px-3 md:px-4"
                type="primary"
                width="fit"
                onClick={() => setIsAddingMedia(true)}
              />
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-400 rounded-2xl p-2 space-y-2">
              {(() => {
                const visibleOriginalMedia = originalMedia?.filter((media: PostMedia) => !deletedMedia.includes(media)) || [];
                const hasVisibleMedia = visibleOriginalMedia.length > 0 || newMedia.length > 0 || isAddingMedia;

                return hasVisibleMedia ? (
                  <>
                    {visibleOriginalMedia.map((media: PostMedia) => {
                      const driveId = extractDriveId(media.mediaUrl);
                      return (
                        <div key={media.id} className="p-2 border border-gray-300 rounded-2xl bg-gray-50">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs text-gray-500 font-medium">Existing:</span>
                              <span className="text-sm text-gray-700 truncate">{driveId}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveOriginalMedia(media)}
                              className="text-contrast hover:text-primary cursor-pointer shrink-0"
                              title="Mark for deletion"
                            >
                              <TbTrash className="size-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {newMedia.map((media: PostMedia, index) => (
                      <div key={`new-${index}`} className="p-2 border border-gray-300 rounded-2xl bg-blue-50">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs text-blue-600 font-medium">New:</span>
                            <span className="text-sm text-gray-700 truncate">{media.mediaUrl}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveNewMedia(media)}
                            className="text-contrast hover:text-primary cursor-pointer shrink-0"
                          >
                            <TbTrash className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {isAddingMedia && (
                      <div className="flex items-center gap-2">
                        <InputField
                          label=""
                          labelClassName="hidden"
                          value={currentMediaInput}
                          placeholder="Enter Google Drive file ID"
                          onChange={(e) => setCurrentMediaInput(e.target.value)}
                          id="mediaUrl"
                        />
                        <Button
                          buttonIcon={<FaCheck className="size-3" />}
                          className="px-2 md:px-3"
                          type="primary"
                          width="fit"
                          onClick={() => {
                            if (currentMediaInput.trim() !== "") {
                              handleAddMedia(currentMediaInput.trim());
                              setCurrentMediaInput("");
                              setIsAddingMedia(false);
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">No additional media added.</p>
                );
              })()}
            </div>
          </div>
        </div>
        <div className="pt-3 border-gray-200 border-t flex items-center gap-2 justify-center">
          <Button
            buttonText="Cancel"
            type="basic"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            buttonText="Submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>

      </div>
    </Modal>
  );
}
