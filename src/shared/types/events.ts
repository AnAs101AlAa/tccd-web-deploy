export default interface Event {
    id: string;
    title: string;
    header: string;
    description: string;
    image: string;
    date: Date;
    category: string; //No idea what the categories are to create an enum of them
    capacity: number;
    registrationCount: number;
    attendeeCount: number;
    //This thing has alot more fields that are references of other fields
    //I have no idea how those added here due to having alot of arbitrary values for events, so keep it simple for now
}
