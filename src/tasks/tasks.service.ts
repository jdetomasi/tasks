import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task: Task = {
      ...createTaskDto,
      userId,
      status: TaskStatus.Todo,
    };
    return this.taskModel.create(task);
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
    const task: Task = await this.taskModel.findOne({ _id: id, userId });
    return task;
  }

  async update(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task: TaskDocument = await this.taskModel.findOne({
      _id: id,
      userId,
    });
    // TODO: handle errors
    task.status = updateTaskDto?.status || task.status;
    task.title = updateTaskDto?.title || task.title;
    task.description = updateTaskDto?.description || task.description;
    return task.save();
  }
}
