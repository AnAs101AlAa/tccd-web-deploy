import { useEffect, useState } from "react";
import { Button, Modal, TextAreaField } from "tccd-ui";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";
import type { Accept } from "react-dropzone";
import FileDropZone from "@/shared/components/FileDropZone";
import type { CommunityPostCardProps } from "@/shared/types";

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPostCardProps;
}) {
  const [postText, setPostText] = useState<string>(post.description);
  function editPost() {
    setIsDisabled(true);
    //submitting logic will be here, when the time comes
    toast.success("Well done, It works!");
    setIsDisabled(false);
  }
  const [files, setFiles] = useState<File[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const acceptedFileTypes: Accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"],
  };

  useEffect(() => {
    const fetchFiles = async () => {
      for (const url of post.postMedia) {
        try {
          //momentarilly, until we configure our bucket for storage then it could be transferred to use our normal api calls
          const response = await fetch(url);
          const blob = await response.blob();
          const urlParts = url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const fileType = blob.type;
          const file = new File([blob], fileName, { type: fileType });

          setFiles((prevFiles) => [...prevFiles, file]);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    };

    fetchFiles();
  }, [post.postMedia]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new Post">
      <TextAreaField
        id="PostText"
        label=""
        placeholder="What's new ?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        maxLength={320}
      />
      <div className="my-4">
        <FileDropZone
          files={files}
          setFiles={setFiles}
          acceptedFileTypes={acceptedFileTypes}
          disabled={isDisabled}
        />
      </div>
      <div>
        <Button
          buttonIcon={<IoIosSend />}
          buttonText="Post"
          type="primary"
          onClick={editPost}
          disabled={postText === "" || isDisabled}
        />
      </div>
    </Modal>
  );
}
