export type Message = {
  fromCurrentUser: boolean;
  username: string,
  text: string;
  image_urls: string[];
};