import { WithNavbar } from "@/shared/components/hoc";
import PostContainer from "../components/postContainer";
import { useGetPostById } from "@/shared/queries/posts";
import { useParams } from "react-router-dom";
import { LoadingPage, ErrorScreen } from "tccd-ui";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useGetPostById(id || "");

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !post) {
    return (
      <ErrorScreen
        title="Post Not Found"
        message="The post you're looking for could not be loaded."
      />
    );
  }

  return (
    <WithNavbar>
      <PostContainer post={post} />
    </WithNavbar>
  );
};

export default PostPage;
