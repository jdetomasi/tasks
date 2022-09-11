import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TaskStatus } from '../enum/task-status.enum';

@Schema({ timestamps: true })
export class Task {
  // TODO: this could be referenced to User (after implemented)
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: String,
    enum: TaskStatus,
  })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
