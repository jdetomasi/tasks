import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../common/decorators/user.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@User() user, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  findAll(@User() user): Promise<Task[]> {
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @User() user,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<Task> {
    // TODO: handle not found error
    return this.tasksService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @User() user,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    // TODO: handle errors
    return this.tasksService.update(user.userId, id, updateTaskDto);
  }
}
