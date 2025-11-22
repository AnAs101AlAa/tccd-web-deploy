import type { CommunityPost, PostStatus } from "@/shared/types/postTypes";
import { Button, LazyImageLoader } from "tccd-ui";
import format from "@/shared/utils/dateFormater";

export interface PostCardProps {
  post: CommunityPost;
  setEditing: (postId: string) => void;
  setDeleting: (postId: string) => void;
}

const statusColors: Record<PostStatus, { bg: string; dot: string; text: string }> = {
  posted: { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700" },
  disabled: { bg: "bg-gray-200", dot: "bg-gray-500", text: "text-gray-800" },
  expired: { bg: "bg-red-100", dot: "bg-[#CD3A38]", text: "text-[#CD3A38]" },
};

export default function PostCard({ post, setEditing, setDeleting }: PostCardProps) {

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-2xl transition hover:shadow-lg relative h-full flex flex-col">
      <LazyImageLoader src={post.postMedia[0]} alt={post.title} className="rounded-t-lg" height="250px" />
      <span className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] md:text-[12px] lg:text-[13px] font-medium ${statusColors[post.status].bg} ${statusColors[post.status].text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statusColors[post.status].dot}`}></span>
        {post.status}
      </span>
      <div className="p-2.5 md:p-4 pt-2 md:pt-3 flex flex-col flex-grow justify-between gap-5">
        <div className="space-y-2">
          <h3 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold mb-3 text-primary">
            {post.title}
          </h3>
          <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast mt-1">
            <strong>Created:</strong> {format(new Date(post.createdAt),"full")}
          </p>

          <p className="text-contrast/80 text-[13px] md:text-[14px] lg:text-[15px]">
            {post.description || "No description."}
          </p>
        </div>
        <div className="flex justify-center gap-2 items-center">
          <Button type="secondary" onClick={() => setEditing(post.id)} buttonText="Edit" width="small" />
          <Button type="danger" onClick={() => setDeleting(post.id)} buttonText="Delete" width="small" />
        </div>
      </div>
    </div>
  );
}
