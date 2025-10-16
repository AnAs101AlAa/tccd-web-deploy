export default interface Event {
    id: string;
    title: string;
    description: string;
    media: string[];
    date: string;
    location: string;
    category: string; 
    capacity: number;
    registeredCount: number;
    attendeeCount: number;
}