import { PostSearchFilter } from "../components/PostSearchFilter";
import PostCard from "../components/PostListingCard";
import type { CommunityPost } from "@/shared/types/postTypes";
import { useState, useEffect } from "react";
import Pagination from "@/shared/components/pagination/Pagination";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { useGetAllPosts } from "@/shared/queries/posts";
import { LoadingPage, Button } from "tccd-ui";
import ManagePostModal from "../components/components/EditPostModal";
import PostDeleteModal from "../components/components/PostDeleteModal";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";

export const PostManagementPage = () => {
  const [searchKey, setSearchKey] = useState("");
  const [editedPost, setEditedPost] = useState<string | null>(null);
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

  const { data, isLoading, error } = useGetAllPosts(currentPage, pageSize, activeFilters);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && (data || error)) {
      setIsInitialLoad(false);
    }
  }, [isLoading, data, error]);

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

  // Show full-page loading only on initial load
  if (isInitialLoad && isLoading) {
    return <LoadingPage />;
  }

  // if(isError) {
  //     return (
  //         <WithLayout>
  //             <ErrorScreen title="Failed to load posts. Using cached data." message='An Error has occurred while loading posts, please try again later.'/>
  //         </WithLayout>
  //     )
  // }

  return (
    <WithLayout>
      <PostDeleteModal
        isOpen={deletedPost != null}
        onClose={() => setDeletedPost(null)}
        postId={deletedPost}
      />
      <ManagePostModal
        mode={editedPost != null}
        post={posts.find((post: CommunityPost) => post.id === editedPost)!}
        onClose={() => {
          setEditedPost(null);
          setCreatePost(false);
        }}
        isOpen={editedPost != null || createPost}
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
          ) : error ? (
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
                      setEditing={setEditedPost}
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
