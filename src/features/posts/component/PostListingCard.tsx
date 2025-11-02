import React, { useState, useEffect, useRef } from "react";

export type PostStatus = "posted" | "disabled" | "expired";

export interface Post {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  expirationDate?: string;
  status: PostStatus;
}

export interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (id: string) => void;
}

const statusColors: Record<PostStatus, { bg: string; dot: string; text: string }> = {
  posted: { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700" },
  disabled: { bg: "bg-gray-200", dot: "bg-gray-500", text: "text-gray-800" },
  expired: { bg: "bg-red-100", dot: "bg-[#CD3A38]", text: "text-[#CD3A38]" },
};

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<Post>(post);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, editedPost]);

  const handleSave = () => {
    onUpdate?.(editedPost);
    setIsEditing(false);
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      onDelete?.(post.id);
      document.activeElement instanceof HTMLElement && document.activeElement.blur();
    }
  };

  const handleChange = (field: keyof Post, value: string) => {
    setEditedPost((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      ref={formRef}
      className="w-full max-w-xl mx-auto bg-white shadow-md rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col justify-between transition hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {isEditing ? (
          <input
            type="text"
            value={editedPost.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full text-lg sm:text-xl font-bold border-b-2 border-[#CD3A38]/30 pb-1 focus:border-[#CD3A38] outline-none"
            style={{ color: "#CD3A38" }}
          />
        ) : (
          <h3
            className="text-lg sm:text-xl font-bold break-words border-b-2 border-[#CD3A38]/30 pb-1 inline-block"
            style={{ color: "#CD3A38" }}
          >
            {post.title}
          </h3>
        )}

        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[post.status].bg} ${statusColors[post.status].text}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusColors[post.status].dot}`}></span>
          {post.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Created: {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-3">
        {isEditing ? (
          <textarea
            value={editedPost.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded-lg p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ color: "#295E7E" }}
            rows={3}
          />
        ) : (
          <p
            className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap break-words"
            style={{ color: "#295E7E" }}
          >
            {post.description || "No description."}
          </p>
        )}
      </div>

      {isEditing && (
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Status:
          </label>
          <select
            value={editedPost.status}
            onChange={(e) => handleChange("status", e.target.value as PostStatus)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-gray-50 hover:bg-white shadow-sm hover:shadow-md transition"
          >
            <option value="posted">Posted</option>
            <option value="disabled">Disabled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-lg transition transform active:scale-95 shadow-sm hover:shadow-lg cursor-pointer focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: "#295E7E" }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditedPost(post);
                setIsEditing(false);
                document.activeElement instanceof HTMLElement && document.activeElement.blur();
              }}
              className="px-4 py-2 border rounded-lg bg-gray-500 hover:bg-gray-600 transition text-white cursor-pointer shadow-sm hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditing(true);
                document.activeElement instanceof HTMLElement && document.activeElement.blur();
              }}
              className="px-4 py-2 border rounded-lg transition text-white cursor-pointer shadow-sm hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: "#295E7E" }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-white rounded-lg transition cursor-pointer shadow-sm hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-red-400"
              style={{ backgroundColor: "#CD3A38" }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
