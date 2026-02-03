import { useEffect, useState } from "react";
import { Button, InputField, Modal, TextAreaField } from "tccd-ui";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";
import type { Accept } from "react-dropzone";
import FileDropZone from "@/shared/components/FileDropZone";
import type { CommunityPost } from "@/shared/types/postTypes";

export default function ManagePostModal({ mode, isOpen, onClose, post }: { mode: boolean, isOpen: boolean; onClose: () => void; post: CommunityPost }) {
  const [postState, setPostState] = useState<CommunityPost>(post);
  const [files, setFiles] = useState<File[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  
  function editPost() {
    setIsDisabled(true);
    //submitting logic will be here, when the time comes
    toast.success("Well done, It works!");
    setIsDisabled(false);
  }
  
  const acceptedFileTypes: Accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"],
  };

  useEffect(() => {
    setPostState(post);
  }, [post]);

  useEffect(() => {
    if(!postState)
      return;

    const fetchFiles = async () => {
      try {
        const filePromises = postState.media.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const urlParts = url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const fileType = blob.type;
          return new File([blob], fileName, { type: fileType });
        });

        const fetchedFiles = await Promise.all(filePromises);
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [postState?.media]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode ? `Edit Post` : `Create Post`}>
      <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast mb-4">Please verify all provided information before submitting the post.</p>
      <div className="space-y-3">
        <InputField
          id="post-title-field"
          label="Post Title"
          placeholder="Job offering announcement"
          value={postState?.name}
          onChange={(e) => setPostState({ ...postState, name: e.target.value })}
        />

        <TextAreaField
          id="post-description-field"
          label="Post Description"
          placeholder="What's new ?"
          value={postState?.description}
          onChange={(e) => setPostState({ ...postState, description: e.target.value })}
        />
        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-label font-semibold mb-2">Attached Media</p>
        <FileDropZone
          files={files}
          setFiles={setFiles}
          acceptedFileTypes={acceptedFileTypes}
          disabled={isDisabled}
        />
        <div className="flex justify-center">
          <Button
            buttonIcon={<IoIosSend className="size-4.5" />}
            buttonText="Submit"
            type="primary"
            width="fit"
            onClick={editPost}
          />
        </div>
      </div>
    </Modal>
  );
}
