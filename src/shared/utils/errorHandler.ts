import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (data?.errors) {
      if (typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(", ");
      }
      return JSON.stringify(data.errors);
    }
    return (
      data?.message || 
      error.response?.statusText || 
      error.message ||
      "An error occurred while fetching data"
    );
  }

  return error instanceof Error ? error.message : "Unexpected error occurred";
}
