
import { useEffect, useState } from 'react';
import { DropdownMenu, Modal, Button } from 'tccd-ui';
import toast from 'react-hot-toast';
import { useAddVolunteer, useEditVolunteer } from '@/shared/queries/admin/volunteers/volunteerQueries';
import { committeeList, positionList } from '@/constants/volunteerInfo';
import type { User } from '@/shared/queries/admin/users/userTypes';

export default function VolunteerRoleManageModal ({mode, memberData, isOpen, onClose}: {mode: 'add' | 'edit', memberData?: User, isOpen: boolean, onClose: () => void}) {
    
    const addVolunteerMutation = useAddVolunteer();
    const editVolunteerMutation = useEditVolunteer();
    const isSubmitting = addVolunteerMutation.isPending || editVolunteerMutation.isPending;

    const [committee, setCommittee] = useState<string>(committeeList[0].value);
    const [position, setPosition] = useState<string>(positionList[0].value);

    useEffect(() => {
        if(isOpen) {
            if(mode === "edit" && memberData?.volunteeringProfile) {
                setCommittee(memberData.volunteeringProfile.committeeAffiliation);
                setPosition(memberData.volunteeringProfile.position);
            } else {
                setCommittee(committeeList[0].value);
                setPosition(positionList[0].value);
            }
        }
    }, [isOpen, memberData, mode]);

    const submitChanges = async () => {
        try {
            if(mode === "add") {
                await addVolunteerMutation.mutateAsync({ committee, position: position, userId: memberData!.id });
                toast.success("user Role added successfully")
            } else if(mode === "edit") {
                await editVolunteerMutation.mutateAsync({ userId: memberData!.id, committee, position: position });
                toast.success("user Role updated successfully")
            }
            onClose();
        } catch {
            toast.error("and error occurred while submitting changes, please try again")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {if(!isSubmitting) onClose()}} title={`${mode === 'add' ? 'Admit' : 'Edit'} user into TCCD member board`}>
            <div className='space-y-3'>
                <DropdownMenu
                    label='Position'
                    labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
                    options={positionList}
                    value={position}
                    onChange={(position) => setPosition(position)}
                />
                <DropdownMenu
                    label='Committee'
                    labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
                    options={committeeList}
                    value={committee}
                    onChange={(committee) => setCommittee(committee)}
                />
            </div>
            <div className="flex w-full justify-center gap-3 mt-5">
                <Button type="basic" onClick={onClose} disabled={isSubmitting} buttonText='Cancel'/>
                <Button type="primary" onClick={submitChanges} disabled={isSubmitting} loading={isSubmitting} buttonText={mode === 'add' ? 'Admit' : 'Save Changes'} />
            </div>
        </Modal>
    )
}