import type { EventSlot } from "@/shared/types";
import { Modal, Button, SearchField } from "tccd-ui";
import { useState } from "react";
import format from "@/shared/utils/dateFormater";
import { DropdownMenu } from "tccd-ui";
import { useGetUsers } from "@/shared/queries/admin/users/userQueries";
import Table from "@/shared/components/adminTables/Table";
import { useAdjustEventRegistration } from "@/shared/queries/admin/events/eventsQueries";

export default function AdjustEventRegistrationModal({isOpen, onClose, eventId, slots } : {isOpen: boolean; onClose: () => void; eventId: string; slots: EventSlot[] }) {
    const [selectedSlotId, setSelectedSlotId] = useState<string>("");
    const [ userNameKey, setUserNameKey] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const { data: usersData } = useGetUsers({ PageNumber: 1, PageSize: 10, EnglishName: userNameKey });
    const adjustRegistrationMutation = useAdjustEventRegistration();

    const handleUpdateRegistration = async () => {
        if (!selectedSlotId || !userNameKey) return;
        await adjustRegistrationMutation.mutateAsync({ eventId, userId: selectedUserId, slotId: selectedSlotId });
        onClose();
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
                <Table
                    items={usersData?.items || []}
                    columns={[
                        {
                            label: "User Name",
                            key: "englishName"
                        },
                        {
                            label: "Email",
                            key: "email"
                        },
                        {
                            label: "phone number",
                            key: "phoneNumber"
                        }
                    ]}
                    renderActions={(item) => {
                        <Button
                            type="primary"
                            buttonText="Select"
                            onClick={() => {
                                setSelectedUserId(item.id);
                            }}
                            disabled={adjustRegistrationMutation.isPending}
                        />
                    }}
                />
                <div className="mt-6 flex justify-center gap-3">
                    <Button type="basic" onClick={() => { if (!adjustRegistrationMutation.isPending) onClose() }} disabled={adjustRegistrationMutation.isPending} buttonText="Cancel" />
                    <Button type="primary" onClick={handleUpdateRegistration} loading={adjustRegistrationMutation.isPending} disabled={!selectedSlotId || !userNameKey} buttonText="Submit" />
                </div>
            </div>
        </Modal>
    );
}