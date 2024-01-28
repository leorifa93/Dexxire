export interface IMessage {
  lastMessage: string;
  lastMessageFromId: string;
  sentAt: number;
  type: 'text' | 'image';
  picture?: { uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string }};
}
