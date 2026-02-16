import type { CommunityPost } from "@/shared/types/postTypes";
import { Button, LazyImageLoader } from "tccd-ui";
import format from "@/shared/utils/dateFormater";
import { FaImage } from "react-icons/fa";
import extractDriveId from "@/shared/utils/googleDriveHelper";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";

export interface PostCardProps {
  post: CommunityPost;
  compact?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  setEditing: (post: CommunityPost) => void;
  setDeleting: (postId: string) => void;
  setApproving: (post: CommunityPost) => void;
}

export default function PostCard({
  post,
  compact = false,
  isSelected = false,
  onSelect,
  setEditing,
  setDeleting,
  setApproving,
}: PostCardProps) {
  const imageUrl = post.media && post.media.length > 0 && post.media[0]
    ? extractDriveId(post.media[0].mediaUrl)
    : null;

  return (
    <div
      className="group relative w-full max-w-xl mx-auto"
      onClick={onSelect}
    >
      <div
        className={`pointer-events-none absolute -inset-[1px] rounded-[11px] bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300 ${
          isSelected
            ? "opacity-100 animate-pulse"
            : "opacity-0 group-hover:opacity-100 group-hover:animate-pulse"
        }`}
      />
      <div
        className={`relative bg-white border shadow-sm rounded-lg transition duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 h-full flex flex-col overflow-hidden ${
          isSelected
            ? "border-transparent ring-2 ring-primary/20"
            : "border-contrast/10 focus-within:ring-primary/20"
        }`}
      >
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`inline-flex items-center px-2 py-1 text-[10px] font-semibold uppercase tracking-normal rounded-md transition-all ${
            post.isApproved
              ? "bg-green-100 text-green-600 border border-green-500"
              : "bg-red-100 text-red-600 border border-red-500"
          }`}
        >
          {post.isApproved ? "Public" : "Private"}
        </span>
      </div>
      {imageUrl ? (
        <LazyImageLoader
          src={imageUrl}
          alt={post.name}
          className="rounded-t-lg"
          height={compact ? "185px" : "225px"}
        />
      ) : (
        <div className={`${compact ? "h-48 sm:h-52" : "h-60 sm:h-62.5"} flex flex-col items-center justify-center bg-linear-to-br from-background to-background/70 rounded-t-lg border-b border-dashed border-contrast/20`}>
          <FaImage className="text-contrast/25 text-5xl sm:text-6xl mb-2" aria-hidden="true" />
          <p className="text-inactive-tab-text text-xs sm:text-sm font-medium">No Image</p>
        </div>
      )}
      <div className={`${compact ? "p-3 gap-3" : "p-3 sm:p-4 gap-3.5"} flex flex-col grow justify-between`}>
        <div className={compact ? "space-y-2" : "space-y-2.5"}>
          <h3 className={`${compact ? "text-[15px] md:text-[16px] lg:text-[17px]" : "text-[16px] md:text-[18px] lg:text-[19px]"} font-semibold leading-snug text-primary line-clamp-2`}>
            {post.name}
          </h3>
          <p className={`${compact ? "text-[11px] md:text-[12px]" : "text-[12px] md:text-[13px]"} text-contrast`}>
            <span className="font-semibold text-contrast/80">Created:</span>{" "}
            {format(new Date(post.createdAt), "full")}
          </p>

          <p className={`text-contrast/80 ${compact ? "text-[11px] md:text-[12px] line-clamp-2 md:line-clamp-3" : "text-[12px] md:text-[13px] lg:text-[14px] line-clamp-3 md:line-clamp-4"} leading-relaxed`}>
            <HTMLFormattedText content={post.description || "No description."} />
          </p>
        </div>
        <div className={`border-t border-contrast/10 ${compact ? "pt-2.5" : "pt-3"}`}>
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${compact ? "gap-1.5" : "gap-2"} pt-1`}>
          <div className={compact ? "col-span-2 sm:col-span-1" : ""}>
            <Button
              type={post.isApproved ? "basic" : "primary"}
              onClick={() => setApproving(post)}
              buttonText={post.isApproved ? "Private" : "Publish"}
              width="full"
            />
          </div>
          <div className={compact ? "col-span-1" : ""}>
            <Button
              type="secondary"
              onClick={() => setEditing(post)}
              buttonText="Edit"
              width="full"
            />
          </div>
          <div className={compact ? "col-span-1" : "col-span-2 sm:col-span-1"}>
            <Button
              type="danger"
              onClick={() => setDeleting(post.id)}
              buttonText="Delete"
              width="full"
            />
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
