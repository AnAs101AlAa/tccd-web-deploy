import { PostSearchFilter } from "../components/PostSearchFilter";
import PostCard from "../components/PostListingCard";
import type { CommunityPost } from "@/shared/types/postTypes";
import { useState, useEffect, useRef } from "react";
import Pagination from "@/shared/components/pagination/Pagination";
import WithLayout from "@/shared/components/hoc/WithLayout";
import { useGetAllPosts } from "@/shared/queries/posts";
import { LoadingPage, Button, ErrorScreen } from "tccd-ui";
import PostDeleteModal from "../components/components/PostDeleteModal";
import ManagePostModal from "../components/components/ManagePostModal";
import PostApprovalModal from "../components/components/PostApprovalModal";
import { POST_SORT_OPTIONS } from "../constants/postConstans";

export const PostManagementPage = () => {
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [deletedPost, setDeletedPost] = useState<string | null>(null);
  const [approvingPost, setApprovingPost] = useState<CommunityPost | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 6
  );
  const [isCompactView, setIsCompactView] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const postsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 3 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [activeFilters, setActiveFilters] = useState<{
    name?: string;
    orderBy?: string;
    descending?: boolean;
  }>({
    orderBy: POST_SORT_OPTIONS[0].value,
    descending: true
  });

  const backendFilters = {
    ...activeFilters,
    orderBy: activeFilters.orderBy?.replace(/(Desc|Asc)$/, '') || undefined,
  };

  const { data, isLoading, isError } = useGetAllPosts(currentPage, pageSize, backendFilters);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;
  const publicPostsCount = posts.filter((post: CommunityPost) => post.isApproved).length;
  const privatePostsCount = posts.length - publicPostsCount;

  useEffect(() => {
    if (!isLoading && (data || isError)) {
      setIsInitialLoad(false);
    }
  }, [isLoading, data, isError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      orderBy: POST_SORT_OPTIONS[0].value,
      descending: true
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      postsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  if (isInitialLoad && isLoading) {
    return <LoadingPage />;
  }

  if (isError && posts.length === 0) {
    return (
      <WithLayout>
        <ErrorScreen
          title="Failed to load posts"
          message="An Error has occurred while loading posts, please try again later."
        />
      </WithLayout>
    );
  }

  return (
    <WithLayout>
      <PostDeleteModal
        isOpen={deletedPost != null}
        onClose={() => setDeletedPost(null)}
        postId={deletedPost}
      />
      <PostApprovalModal
        isOpen={approvingPost !== null}
        onClose={() => setApprovingPost(null)}
        postId={approvingPost?.id || null}
        currentApprovalStatus={approvingPost?.isApproved || false}
      />
      {(createPost || selectedPost) && (
        <ManagePostModal
          initialData={selectedPost || undefined}
          onClose={() => {
            setSelectedPost(null);
            setCreatePost(false);
          }}
          isOpen={createPost || selectedPost !== null}
        />
      )}
      <div className="min-h-screen bg-background py-4 md:py-8 px-4 md:px-8">
        <main className="w-full max-w-400 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-4 md:mb-6">
            <div>
              <p className="text-[12px] md:text-[13px] tracking-wide uppercase font-semibold text-inactive-tab-text">
                Content Management
              </p>
              <p className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-secondary">
                Posts
              </p>
              <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
                Manage community posts, content updates, and visibility status.
              </p>
            </div>
            <Button
              width="fit"
              type="primary"
              onClick={() => setCreatePost(true)}
              buttonText="New Post"
            />
          </div>

          <section
            ref={postsSectionRef}
            className="relative overflow-hidden rounded-xl border border-contrast/10 bg-linear-to-b from-background/85 to-background/65 p-4 sm:p-5 lg:p-6 shadow-sm"
          >
            <div className="pointer-events-none absolute -top-20 -right-12 h-48 w-48 rounded-full bg-primary/8 blur-2xl" />

            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <div className="rounded-lg border border-contrast/10 bg-white/70 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-inactive-tab-text font-semibold">
                  Total
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-secondary">{posts.length}</p>
              </div>
              <div className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-inactive-tab-text font-semibold">
                  Public
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-secondary">{publicPostsCount}</p>
              </div>
              <div className="rounded-lg border border-contrast/20 bg-background/85 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-inactive-tab-text font-semibold">
                  Private
                </p>
                <p className="text-[18px] md:text-[20px] font-bold text-secondary">{privatePostsCount}</p>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <PostSearchFilter
                searchKey={activeFilters.name || ""}
                orderBy={POST_SORT_OPTIONS.find(option => option.value === activeFilters.orderBy) || POST_SORT_OPTIONS[0]}
                onOrderByChange={(option) => setActiveFilters(prev => ({ ...prev, orderBy: option.value }))}
                onSearchChange={(val) => setActiveFilters(prev => ({ ...prev, name: val }))}
                setDescending={(desc) => setActiveFilters(prev => ({ ...prev, descending: desc }))}
                onSearch={handleSearch}
                onClear={handleClearFilters}
              />
            </div>

            {isError && posts.length > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 mb-4">
                <p className="text-secondary text-sm md:text-[15px] font-medium">
                  Could not refresh posts from server. Showing last available data.
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-3">
                <div className="animate-spin rounded-full h-11 w-11 border-b-2 border-contrast"></div>
                <p className="text-sm md:text-[15px] text-inactive-tab-text font-medium">
                  Loading posts...
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCompactView((prev) => !prev)}
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                        isCompactView
                          ? "border-primary/30 bg-primary/10 text-secondary"
                          : "border-contrast/20 bg-white/80 text-inactive-tab-text"
                      }`}
                    >
                      View: {isCompactView ? "Compact" : "Comfortable"}
                    </button>
                    {activeFilters.name && (
                      <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-secondary">
                        Filter: {activeFilters.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${isCompactView ? "gap-3 md:gap-4" : "gap-4 md:gap-5"} grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3`}>
                  {posts.map((post: CommunityPost) => (
                    <div key={post.id} className="w-full py-4">
                      <PostCard
                        post={post}
                        compact={isCompactView}
                        isSelected={highlightedPostId === post.id}
                        onSelect={() => setHighlightedPostId(post.id)}
                        setEditing={(selected) => {
                          setSelectedPost(selected);
                          setHighlightedPostId(selected.id);
                        }}
                        setDeleting={() => {
                          setDeletedPost(post.id);
                          setHighlightedPostId(post.id);
                        }}
                        setApproving={(selected) => {
                          setApprovingPost(selected);
                          setHighlightedPostId(selected.id);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {posts.length === 0 && (
                  <div className="text-center py-10 rounded-lg border border-dashed border-contrast/20 bg-white/45">
                    <p className="text-inactive-tab-text text-sm md:text-base font-medium">
                      No posts found matching your criteria.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button
                        width="fit"
                        type="primary"
                        onClick={() => setCreatePost(true)}
                        buttonText="Create First Post"
                      />
                    </div>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="pt-4 mt-1 border-t border-contrast/10">
                    <p className="text-[12px] text-inactive-tab-text text-center mb-2">
                      Navigate between pages
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </WithLayout>
  );
};
