import { PostManagmentCard } from '../components/PostManagmentCard';
import { PostSearchFilter } from '../components/PostSearchFilter';
import type { CommunityPostCardProps } from '@/shared/types';
import { useState, useEffect, useMemo } from 'react';
import { usePagination } from '@/shared/hooks';
import Pagination from '@/shared/components/pagination/Pagination';
import UpperHeader from '@/shared/components/mainpages/UpperHeader';
import WithNavbar from '@/shared/components/hoc/WithNavbar';
import { useGetAllPosts } from '@/shared/queries/posts';
import toast from 'react-hot-toast';

const dummyPosts: (CommunityPostCardProps & { status: string })[] = [
    {
        id: '1',
        createdOn: '2023-10-01T00:00:00Z',
        name: 'Community Event Announcement',
        description: 'Join us for an exciting community event where we will discuss the latest trends in technology and innovation. This is a great opportunity to network with like-minded individuals and share ideas about the future of our industry.',
        postMedia: ['https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE'],
        status: 'posted'
    },
    {
        id: '2',
        createdOn: '2023-09-15T00:00:00Z',
        name: 'Volunteer Opportunity',
        description: 'We are looking for volunteers to help with our upcoming charity drive. Your contribution can make a real difference in the lives of those in need. If you are interested in giving back to the community, please sign up today.',
        postMedia: ['https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY'],
        status: 'expired'
    },
    {
        id: '3',
        createdOn: '2023-08-20T00:00:00Z',
        name: 'New Member Welcome',
        description: 'Welcome our newest members to the community! We are thrilled to have you join us and look forward to your contributions. Let\'s work together to make this community even better.',
        postMedia: [],
        status: 'disabled'
    }
];

export const PostManagementPage = () => {
    const [searchKey, setSearchKey] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const { data: apiPosts, isLoading, isError } = useGetAllPosts();

    const posts = apiPosts || dummyPosts;

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            const statusOrder = { posted: 0, expired: 1, disabled: 2 };
            const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
            const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
            return aOrder - bOrder;
        });
    }, [posts]);

    const filteredPosts = useMemo(() => {
        let filtered = sortedPosts;

        if (searchKey.trim()) {
            filtered = filtered.filter(post =>
                post.name.toLowerCase().includes(searchKey.toLowerCase()) ||
                post.description.toLowerCase().includes(searchKey.toLowerCase())
            );
        }

        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(post => selectedStatuses.includes(post.status));
        }

        return filtered;
    }, [searchKey, selectedStatuses, sortedPosts]);

    const { currentPage, paginatedItems, totalPages, setPage } = usePagination<(CommunityPostCardProps & { status: string })>({
        items: filteredPosts,
        itemsPerPageMobile: 3,
        itemsPerPageDesktop: 6,
    });

    useEffect(() => {
        setPage(1);
    }, [searchKey, selectedStatuses, setPage]);

    useEffect(() => {
        if (isError) {
            toast.error("Failed to load posts. Using cached data.");
        }
    }, [isError]);

    if (isLoading) {
        return (
            <WithNavbar>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contrast mx-auto mb-4"></div>
                        <p className="text-lg text-secondary">Loading posts...</p>
                    </div>
                </div>
            </WithNavbar>
        );
    }

    return (
        <WithNavbar>
            <div className="min-h-screen bg-gray-50">
                <UpperHeader
                    image=""
                    title="Post Management"
                    subtitle="Manage and oversee all community posts with powerful search and filtering capabilities"
                />

                <main className="w-[98%] md:w-[84%] lg:w-[80%] mx-auto px-6 py-5">
                    <section className="mb-16">
                        <div className="mb-6">
                            <PostSearchFilter
                                searchKey={searchKey}
                                onSearchChange={setSearchKey}
                                selectedStatuses={selectedStatuses}
                                onStatusesChange={setSelectedStatuses}
                                onSearch={() => { }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedItems.map(post => (
                                <PostManagmentCard key={post.id} {...post} />
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
                    </section>
                </main>
            </div>
        </WithNavbar>
    );
};