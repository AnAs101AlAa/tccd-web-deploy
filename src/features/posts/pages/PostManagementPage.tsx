import { PostSearchFilter } from '../components/PostSearchFilter';
import PostCard from '../components/PostListingCard';
import type { CommunityPost } from '@/shared/types/postTypes';
import { useState, useEffect } from 'react';
import { usePagination } from '@/shared/hooks';
import Pagination from '@/shared/components/pagination/Pagination';
import WithNavbar from '@/shared/components/hoc/WithNavbar';
import { useGetAllPosts } from '@/shared/queries/posts';
import { LoadingPage, ErrorScreen, Button } from 'tccd-ui';
import ManagePostModal from '../components/components/EditPostModal';
import PostDeleteModal from '../components/components/PostDeleteModal';

const dummyPosts: CommunityPost[] = [
    {
        id: '1',
        createdAt: '2023-10-01T00:00:00Z',
        title: 'Community Event Announcement',
        description: 'Join us for an exciting community event where we will discuss the latest trends in technology and innovation. This is a great opportunity to network with like-minded individuals and share ideas about the future of our industry.',
        postMedia: ['https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE'],
        status: 'posted'
    },
    {
        id: '2',
        createdAt: '2023-09-15T00:00:00Z',
        title: 'Volunteer Opportunity',
        description: 'We are looking for volunteers to help with our upcoming charity drive. Your contribution can make a real difference in the lives of those in need. If you are interested in giving back to the community, please sign up today.',
        postMedia: ['https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY'],
        status: 'expired'
    },
    {
        id: '3',
        createdAt: '2023-08-20T00:00:00Z',
        title: 'New Member Welcome',
        description: 'Welcome our newest members to the community! We are thrilled to have you join us and look forward to your contributions. Let\'s work together to make this community even better.',
        postMedia: ['https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY'],
        status: 'disabled'
    }
];

export const PostManagementPage = () => {
    const [searchKey, setSearchKey] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [editedPost, setEditedPost] = useState<string | null>(null);
    const [createPost, setCreatePost ] = useState<boolean>(false);
    const [deletedPost, setDeletedPost] = useState<string | null>(null);

    const { data: apiPosts, isLoading, isError } = useGetAllPosts();

    const posts = apiPosts || dummyPosts;

    const { currentPage, paginatedItems, totalPages, setPage } = usePagination<(CommunityPost)>({
        items: posts,
        itemsPerPageMobile: 3,
        itemsPerPageDesktop: 6,
    });

    useEffect(() => {
        setPage(1);
    }, [searchKey, selectedStatuses, setPage]);

    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }

    // if(isError) {
    //     return (
    //         <WithNavbar>
    //             <ErrorScreen title="Failed to load posts. Using cached data." message='An Error has occurred while loading posts, please try again later.'/>
    //         </WithNavbar>
    //     )
    // }

    return (
        <WithNavbar>
            <PostDeleteModal isOpen={deletedPost != null} onClose={() => setDeletedPost(null)} postId={deletedPost} />
            <ManagePostModal mode={editedPost != null} post={posts.find(post => post.id === editedPost)!} onClose={() => {setEditedPost(null); setCreatePost(false)}} isOpen={editedPost != null || createPost}  />
            <div className="min-h-screen bg-gray-50">
                <main className="w-[98%] md:w-[92%] lg:w-[86%] mx-auto px-6 py-5">
                    <div className='flex sm:flex-row flex-col justify-between mb-4 gap-y-2'>
                        <div>
                            <h1 className="text-[22px] md:text-[24px] lg:text-[26px] font-semibold">Post Management</h1>
                            <p className="text-contrast/80 text-[14px] md:text-[15px] lg:text-[16px]">Manage community posts, edit content, and monitor post status.</p>
                        </div>
                        <Button width='fit' type="primary" onClick={() => setCreatePost(true)} buttonText="New Post" />
                    </div>
                    <div className="mb-6">
                        <PostSearchFilter
                            searchKey={searchKey}
                            onSearchChange={setSearchKey}
                            selectedStatuses={selectedStatuses}
                            onStatusesChange={setSelectedStatuses}
                            onSearch={() => { }}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:flex-wrap gap-[2%] gap-y-5">
                        {paginatedItems.map(post => (
                            <div className='w-full md:w-[49%] xl:w-[32%]'>
                                <PostCard key={post.id} post={post} setEditing={setEditedPost} setDeleting={setDeletedPost} />
                            </div>
                        ))}
                    </div>

                    {paginatedItems.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No posts found matching your criteria.</p>
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </main>
            </div>
        </WithNavbar>
    );
};