import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserDocument } from './entities/user.entity';

const users: UserDocument[] = [
  {
    _id: new Types.ObjectId('62e9804bfe90bd0e7155da45'),
    username: 'julian',
    email: 'julian@gmail.com',
    password: '$2b$10$jiJqsV58x9FC0U4nXCHSruSm59rDC76oiG/TcCC1qW2izN6.Lw0iq',
  } as UserDocument,
  {
    _id: new Types.ObjectId('6304f46083fbbbc9e379d42a'),
    username: 'test',
    email: 'test@email.com',
    password: '$2b$10$jiJqsV58x9FC0U4nXCHSruSm59rDC76oiG/TcCC1qW2izN6.Lw0iq',
  } as UserDocument,
];

@Injectable()
export class UserService {
  async findByUsername(username: string): Promise<UserDocument | undefined> {
    return users.find((u) => u.username === username);
  }
}
