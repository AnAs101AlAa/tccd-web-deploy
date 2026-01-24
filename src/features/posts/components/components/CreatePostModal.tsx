import { useState } from "react";
import { Button, Modal, TextAreaField } from "tccd-ui";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";
import type { Accept } from "react-dropzone";
import FileDropZone from "@/shared/components/FileDropZone";

export default function CreatePostModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [postText, setPostText] = useState<string>("");
  function createPost() {
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new Post">
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
          onClick={createPost}
          disabled={postText === "" || isDisabled}
        />
      </div>
    </Modal>
  );
}
