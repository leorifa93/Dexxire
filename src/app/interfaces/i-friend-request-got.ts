export interface IFriendRequestSent {
  sentTo: {
    id: string,
    username: string,
    profilePictures: any
  }
  sentAt: number;
}
