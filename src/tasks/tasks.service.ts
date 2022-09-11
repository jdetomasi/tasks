import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  private validateTaskExists(task: Task) {
    if (!task) {
      throw new NotFoundException();
    }
  }

  private validateUserPermissions(userId: Types.ObjectId, task: Task): void {
    if (task && !task.userId.equals(userId)) {
      throw new ForbiddenException();
    }
  }

  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task: Task = await this.taskModel.create({
      ...createTaskDto,
      userId,
    });
    return task;
  }

  // TODO: we should probably do some pagination/filtering/sorting here
  async findAll(userId: Types.ObjectId): Promise<Task[]> {
    const tasks: Task[] = await this.taskModel.find({ userId });
    return tasks;
  }

  async findOne(
    userId: Types.ObjectId,
    id: Types.ObjectId,
  ): Promise<Task | undefined> {
    const task: Task = await this.taskModel.findById({ _id: id });

    // validate task
    this.validateTaskExists(task);
    // validate users are only allowed to retrieve tasks they own (not from other users)
    this.validateUserPermissions(userId, task);

    return task;
  }

  async update(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task: TaskDocument = await this.taskModel.findById(id);

    // validate task
    this.validateTaskExists(task);
    // validate users are only allowed to retrieve tasks they own (not from other users)
    this.validateUserPermissions(userId, task);

    task.status = updateTaskDto?.status ?? task.status;
    task.title = updateTaskDto?.title ?? task.title;
    task.description = updateTaskDto?.description ?? task.description;

    return task.save();
  }
}
