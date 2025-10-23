import type Event from "@/shared/types/events";

const eventDetails: Event[] = [
  {
    id: "1",
    title: "Tech Innovation Summit",
    description:
      "Dive into a full-day experience covering the latest in AI, cloud computing, and edge technologies with hands-on demos and expert panels.",
    eventPoster:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80",
    media: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    ],
    date: "2025-11-18T09:30:00Z",
    location: "Innovation Hub, Level 3 Auditorium",
    category: "Conference",
    capacity: 220,
    registeredCount: 168,
    attendeeCount: 0
  },
  {
    id: "2",
    title: "Design Thinking Workshop",
    description:
      "A collaborative workshop guiding participants through the design thinking process with real-world challenges and rapid prototyping sessions.",
    eventPoster:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    media: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
      "https://www.youtube.com/embed/9J5VJ2Dz_KQ"
    ],
    date: "2025-12-03T13:00:00Z",
    location: "Creative Studio, Building B",
    category: "Workshop",
    capacity: 60,
    registeredCount: 42,
    attendeeCount: 0
  },
  {
    id: "3",
    title: "Startup Pitch Night",
    description:
      "Ten ambitious startups pitch their big ideas to a panel of seasoned investors. Network, learn, and witness the next disruptive ventures.",
    eventPoster:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    media: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
      "https://cdn.coverr.co/videos/coverr-business-meeting-in-progress-4096-1080p.mp4"
    ],
    date: "2025-12-15T18:30:00Z",
    location: "Founders Arena",
    category: "Pitch Event",
    capacity: 150,
    registeredCount: 97,
    attendeeCount: 0
  }
];

export default eventDetails;
