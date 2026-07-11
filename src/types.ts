/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlasterService {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  minPrice: number; // price per m2
  maxPrice: number; // price per m2
  pros: string[];
  cons: string[];
  bestFor: string;
  dryingTime: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  experience: string;
  avatar: string;
  skills: { name: string; percentage: number }[];
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  plasterType: string;
  area: number;
  description: string;
  estimatedPrice: number;
  status: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface Review {
  name: string;
  city: string;
  rating: number;
  date: string;
  service: string;
  text: string;
}
