import { PostSearchFilter } from "../components/PostSearchFilter";
import PostCard from "../components/PostListingCard";
import type { CommunityPost } from "@/shared/types/postTypes";
import { useState, useEffect } from "react";
import Pagination from "@/shared/components/pagination/Pagination";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { useGetAllPosts } from "@/shared/queries/posts";
import { LoadingPage, Button, ErrorScreen } from "tccd-ui";
import PostDeleteModal from "../components/components/PostDeleteModal";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import ManagePostModal from "../components/components/ManagePostModal";

export const PostManagementPage = () => {
  const [searchKey, setSearchKey] = useState("");
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [deletedPost, setDeletedPost] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const pageSize = isMobile ? 3 : 6;

  const [activeFilters, setActiveFilters] = useState<{
    name?: string;
  }>({});

  const { data, isLoading, isError } = useGetAllPosts(currentPage, pageSize, activeFilters);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && (data || isError)) {
      setIsInitialLoad(false);
    }
  }, [isLoading, data, isError]);

  const handleSearch = () => {
    const filters: any = {};

    if (searchKey.trim()) {
      filters.name = searchKey.trim();
    }

    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isInitialLoad && isLoading) {
    return <LoadingPage />;
  }

  if(isError) {
      return (
          <WithLayout>
              <ErrorScreen title="Failed to load posts. Using cached data." message='An Error has occurred while loading posts, please try again later.'/>
          </WithLayout>
      )
  }

  return (
    <WithLayout>
      <PostDeleteModal
        isOpen={deletedPost != null}
        onClose={() => setDeletedPost(null)}
        postId={deletedPost}
      />
      <ManagePostModal
        initialData={selectedPost || { name: "", description: "", media: [], priority: 0, createdAt: new Date().toISOString(), id: "" }}
        onClose={() => {
          setSelectedPost(null);
          setCreatePost(false);
        }}
        isOpen={createPost || selectedPost !== null}
      />
      <div className="min-h-screen bg-gray-50">
        <UpperHeader
          image=""
          title="Post Management"
          subtitle="Manage community posts, edit content, and monitor post status."
        />
        <main className="w-[98%] md:w-[92%] lg:w-[86%] mx-auto px-6 py-5">
          <div className="flex justify-end mb-4">
            <Button
              width="fit"
              type="primary"
              onClick={() => setCreatePost(true)}
              buttonText="New Post"
            />
          </div>
          <div className="mb-6">
            <PostSearchFilter
              searchKey={searchKey}
              onSearchChange={setSearchKey}
              onSearch={handleSearch}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">
                An error occurred while fetching posts. Please try again.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-[2%] gap-y-5">
                {posts.map((post: CommunityPost) => (
                  <div key={post.id} className="w-full md:w-[49%] xl:w-[32%]">
                    <PostCard
                      post={post}
                      setEditing={setSelectedPost}
                      setDeleting={setDeletedPost}
                    />
                  </div>
                ))}
              </div>

              {posts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No posts found matching your criteria.
                  </p>
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </WithLayout>
  );
};
