import type { Color } from "framer-motion";

export interface BoardMember {
  ImgSrc: string;
  Name: string;
  Role: string;
}

export interface WebsiteFounder {
  ImgSrc: string;
  Name: string;
  Role: string;
  email?: string;
  linkedin?: string;
  github?: string;
}
export type SocialLink = {
  name: string;
  url: string;
  color:Color;
};