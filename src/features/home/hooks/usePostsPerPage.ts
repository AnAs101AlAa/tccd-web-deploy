import { useState, useEffect } from "react";

export const usePostsPerPage = () => {
  const [postsPerPage, setPostsPerPage] = useState<number>(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setPostsPerPage(3); // 2xl screens - 3 posts per page
      } else if (window.innerWidth >= 768) {
        setPostsPerPage(2); // md screens - 2 posts per page
      } else {
        setPostsPerPage(1); // sm screens - 1 post per page
      }
    };

    // Initial call
    handleResize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return postsPerPage;
};
