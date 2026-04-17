import type { EventSlot } from "@/shared/types";
import { Modal, Button, SearchField } from "tccd-ui";
import { useEffect, useState } from "react";
import format from "@/shared/utils/dateFormater";
import { DropdownMenu } from "tccd-ui";
import { useGetUsers } from "@/shared/queries/admin/users/userQueries";
import { useAdjustEventRegistration } from "@/shared/queries/admin/events/eventsQueries";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdjustEventRegistrationModal({isOpen, onClose, eventId, slots } : {isOpen: boolean; onClose: () => void; eventId: string; slots: EventSlot[] }) {
    const [selectedSlotId, setSelectedSlotId] = useState<string>("");
    const [ userNameKey, setUserNameKey] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [userNameKey]);

    const { data: usersData } = useGetUsers({ PageNumber: currentPage, PageSize: 10, EnglishName: userNameKey });
    const adjustRegistrationMutation = useAdjustEventRegistration();

    const handleUpdateRegistration = async () => {
        if (!selectedSlotId || !userNameKey) return;
        try {
            await adjustRegistrationMutation.mutateAsync({ eventId, userId: selectedUserId, slotId: selectedSlotId });
            toast.success("Event registration updated successfully");
            onClose();
        } catch{
            toast.error("Failed to update event registration");
        }
    }

    return (
        <Modal
        title={"Adjust Event Registrations"}
        isOpen={isOpen}
        onClose={() => { if (!adjustRegistrationMutation.isPending) onClose() }}
        className="lg:max-w-none xl:max-w-none lg:w-4/5 xl:w-3/4"
        >
            <div className="space-y-4">
                <DropdownMenu
                    labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
                    label="Select Time Slot"
                    options={slots.map(slot => ({ label: `${format(slot.startTime, "hourFull")} – ${format(slot.endTime, "hourFull")}`, value: slot.id }))}
                    value={selectedSlotId}
                    onChange={(value: string) => setSelectedSlotId(value)}
                />
                <SearchField
                    placeholder="Enter user name"
                    value={userNameKey}
                    onChange={(value: string) => setUserNameKey(value)}
                />
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-400">
                            <th className="py-2 px-3 text-gray-600 text-[13px] md:text-[14px] lg:text-[15px]">User Name</th>
                            <th className="py-2 px-3 text-gray-600 text-[13px] md:text-[14px] lg:text-[15px]">Email</th>
                            <th className="py-2 px-3 text-gray-600 text-[13px] md:text-[14px] lg:text-[15px]">Phone Number</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData?.items.map(user => (
                            <tr key={user.id} className={`border-b cursor-pointer border-gray-400`} onClick={() => setSelectedUserId(user.id)}>
                                <td className="py-2 px-3 whitespace-nowrap">{user.englishName}</td>
                                <td className="py-2 px-3 whitespace-nowrap">{user.email}</td>
                                <td className="py-2 px-3 whitespace-nowrap">{user.phoneNumber}</td>
                                <td className="py-2 px-3 text-right">
                                    {selectedUserId === user.id && <span className="text-blue-500 text-sm">Selected</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center items-center gap-2">
                    <FaChevronLeft className={`size-4 ${currentPage === 1 ? "text-gray-300" : "text-gray-600 cursor-pointer"}`} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                    <span className="text-sm text-gray-600">{currentPage}/{usersData?.totalPages || 1}</span>
                    <FaChevronRight className={`size-4 ${!usersData || currentPage >= usersData.totalPages ? "text-gray-300" : "text-gray-600 cursor-pointer"}`} onClick={() => setCurrentPage(prev => prev + 1)} />
                </div>
                <div className="mt-6 flex justify-center gap-3">
                    <Button type="basic" onClick={() => { if (!adjustRegistrationMutation.isPending) onClose() }} disabled={adjustRegistrationMutation.isPending} buttonText="Cancel" />
                    <Button type="primary" onClick={handleUpdateRegistration} loading={adjustRegistrationMutation.isPending} disabled={!selectedSlotId || !selectedUserId} buttonText="Submit" />
                </div>
            </div>
        </Modal>
    );
}