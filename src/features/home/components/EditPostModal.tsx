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
      try {
        const filePromises = post.postMedia.map(async (url) => {
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
  }, [post.postMedia]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <div className="w-11/12 m-auto">
        <TextAreaField
          id="PostText"
          label=""
          placeholder="What's new ?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={320}
        />
      </div>
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
