import type { CommunityPost } from "@/shared/types/postTypes";
import { Button, LazyImageLoader } from "tccd-ui";
import format from "@/shared/utils/dateFormater";
import { FaImage } from "react-icons/fa";
import extractDriveId from "@/shared/utils/googleDriveHelper";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";

export interface PostCardProps {
  post: CommunityPost;
  setEditing: (post: CommunityPost) => void;
  setDeleting: (postId: string) => void;
}

export default function PostCard({ post, setEditing, setDeleting }: PostCardProps) {
  const imageUrl = post.media && post.media.length > 0 && post.media[0]
    ? extractDriveId(post.media[0].mediaUrl)
    : null;

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-2xl transition hover:shadow-lg relative h-full flex flex-col">
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg backdrop-blur-sm transition-all ${
            post.isApproved
              ? "bg-linear-to-r from-green-500 to-emerald-600 text-white border border-green-300/50 hover:shadow-green-500/50"
              : "bg-linear-to-r from-gray-600 to-gray-700 text-white border border-gray-400/50 hover:shadow-gray-500/50"
          }`}
        >
          {post.isApproved ? "Public" : "Private"}
        </span>
      </div>
      {imageUrl ? (
        <LazyImageLoader src={imageUrl} alt={post.name} className="rounded-t-lg" height="250px" />
      ) : (
        <div className="h-62.5 flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-t-lg border-b-2 border-dashed border-gray-300">
          <FaImage className="text-gray-300 text-5xl sm:text-6xl mb-2" aria-hidden="true" />
          <p className="text-gray-400 text-sm font-medium">No Image</p>
        </div>
      )}
      <div className="p-2.5 md:p-4 pt-2 md:pt-3 flex flex-col grow justify-between gap-5">
        <div className="space-y-2">
          <h3 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold mb-3 text-primary">
            {post.name}
          </h3>
          <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast mt-1">
            <strong>Created:</strong> {format(new Date(post.createdAt), "full")}
          </p>

          <p className="text-contrast/80 text-[13px] md:text-[14px] lg:text-[15px] line-clamp-4">
            <HTMLFormattedText content={post.description || "No description."} />
          </p>
        </div>
        <div className="flex justify-center gap-2 items-center">
          <Button type="secondary" onClick={() => setEditing(post)} buttonText="Edit" width="small" />
          <Button type="danger" onClick={() => setDeleting(post.id)} buttonText="Delete" width="small" />
        </div>
      </div>
    </div>
  );
}
