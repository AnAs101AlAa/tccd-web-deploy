import type { Accept } from "react-dropzone";

export interface DropZoneProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  acceptedFileTypes?: Accept;
  disabled?: boolean;
}
