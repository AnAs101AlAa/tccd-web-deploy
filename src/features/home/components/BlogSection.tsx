import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { BlogPostCard } from "./BlogPostCard";
import { useState, useEffect, useRef } from "react";
import type { CommunityPost } from "@/shared/types";
import { useGetAllPosts } from "@/shared/queries/posts";

const BlogSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<number>(3);
  const sectionRef = useRef<HTMLDivElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetAllPosts(currentPage, postsPerPage);

  const latestPosts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  // Set posts per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPostsPerPage(3); // lg screens - 3 posts per page
      } else if (window.innerWidth >= 768) {
        setPostsPerPage(2); // md screens - 2 posts per page
      } else {
        setPostsPerPage(1); // sm screens - 1 post per page
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentPage((prev) => {
      if (prev === 1) {
        return totalPages;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentPage((prev) => {
      if (prev >= totalPages) {
        return 1;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="py-10 md:py-16 bg-gray-50 transition-transform duration-700 ease-out">
      <div
        ref={sectionRef}
        className={`container px-4 md:px-6 mx-auto ${isVisible ? "fade-in-right" : ""
          }`}
      >
        {/* Latest Blog Posts */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-5 md:mb-8 lg:mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-[#295E7E]">
              Latest News
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-950">
              Engineering Insights
            </h2>
            <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed">
              Explore the latest articles, research, and perspectives from our
              engineering community.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(postsPerPage)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : latestPosts.length > 0 ? (
          <>
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-hidden pb-4"
              ref={gridRef}
            >
              {latestPosts.map((post: CommunityPost) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            {/* Navigation arrows - only show if there are multiple pages */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-5 md:mt-8 items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                  aria-label="Previous posts"
                >
                  <FaArrowLeft className="text-[#295E7E]" />
                </button>

                <span className="text-sm font-medium text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                  aria-label="Next posts"
                >
                  <FaArrowRight className="text-[#295E7E]" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No blog posts available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
