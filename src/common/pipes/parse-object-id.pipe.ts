import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId>
{
  public transform(value: string): Types.ObjectId {
    try {
      return new Types.ObjectId(value);
    } catch {
      throw new BadRequestException(`${value} is not a valid ObjectId`);
    }
  }
}
