export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  capacity: number;
  price: number;
  rating: number;
  reviews: number;
  img: string;
  images?: string[];
  verified: boolean;
  popular: boolean;
  isNew: boolean;
  bestValue: boolean;
  amenities: string[];
  categories: string[];
  foodTypes: string[];
}

export const MOCK_VENUES: Venue[] = [
  {
    id: "the-royal-ballroom",
    name: "The Royal Ballroom",
    location: "Janakpuri",
    city: "Delhi",
    type: "Banquet Hall",
    capacity: 650,
    price: 1800,
    rating: 4.8,
    reviews: 124,
    img: "/venues/royal-ballroom.png",
    verified: true,
    popular: true,
    isNew: false,
    bestValue: true,
    amenities: ["Parking Available", "Catering Available", "Air Conditioned Hall", "Power Backup"],
    categories: ["Wedding Events", "Engagement Ceremony", "Social Gatherings", "Anniversary Party", "Banquet Halls"],
    foodTypes: ["Veg", "Non-Veg"]
  },
  {
    id: "grand-palace-hotel",
    name: "Grand Palace Hotel",
    location: "Dwarka",
    city: "Delhi",
    type: "Hotel",
    capacity: 1200,
    price: 3200,
    rating: 4.7,
    reviews: 89,
    img: "/venues/palace-hotel.png",
    verified: true,
    popular: false,
    isNew: true,
    bestValue: false,
    amenities: ["Outdoor Lawn", "Guest Rooms", "Wheelchair Accessible", "Bridal Room"],
    categories: ["Wedding Events", "Corporate Events", "Housewarming Party", "Wedding Venues"],
    foodTypes: ["Veg", "Non-Veg", "Both"]
  },
  {
    id: "luna-rooftop-lounge",
    name: "Luna Rooftop Lounge",
    location: "Andheri West",
    city: "Mumbai",
    type: "Rooftop Venue",
    capacity: 150,
    price: 2500,
    rating: 4.9,
    reviews: 56,
    img: "/venues/rooftop.png",
    verified: false,
    popular: true,
    isNew: true,
    bestValue: false,
    amenities: ["DJ or Music System", "Catering Available", "Parking Available"],
    categories: ["Birthday Party", "Bachelor / Bachelorette Party", "Kitty Party", "Birthday Party Venues"],
    foodTypes: ["Non-Veg", "Both"]
  },
  {
    id: "emerald-gardens",
    name: "Emerald Gardens",
    location: "Electronic City",
    city: "Bangalore",
    type: "Party Lawn",
    capacity: 2000,
    price: 1500,
    rating: 4.6,
    reviews: 210,
    img: "/venues/garden.png",
    verified: true,
    popular: true,
    isNew: false,
    bestValue: true,
    amenities: ["Outdoor Lawn", "Parking Available", "Power Backup", "In-house Decoration"],
    categories: ["Wedding Events", "Social Gatherings", "Family Functions", "Party Lawns"],
    foodTypes: ["Veg"]
  }
];
