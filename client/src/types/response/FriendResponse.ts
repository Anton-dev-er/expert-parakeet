import { User } from '@/src/types';

export interface FriendResponse {
  id: string;
  isAccepted: boolean;
  isDeclined: boolean;
  user: User;
}
