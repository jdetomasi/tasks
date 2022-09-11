import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const mockedTasksModel = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockedTasksModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    mockedTasksModel.create.mockClear();
    mockedTasksModel.findById.mockClear();
    mockedTasksModel.find.mockClear();
  });

  describe('update', () => {
    it('should update task', async () => {
      const userId = new Types.ObjectId();
      const taskId = new Types.ObjectId();
      const mockedTaskDocument = {
        userId,
        save: jest.fn()
      } as any as TaskDocument;

      mockedTasksModel.findById.mockResolvedValue(mockedTaskDocument);

      await service.update(userId, taskId, { status: TaskStatus.Done });

      expect(mockedTaskDocument.save).toBeCalled();
      expect(mockedTaskDocument.status).toBe(TaskStatus.Done);
    });

    it('should throw exception when user is not allowed to update a task', async () => {
      const userId = new Types.ObjectId();
      const taskId = new Types.ObjectId();
      const mockedTaskDocument = {
        userId: new Types.ObjectId(),
        save: jest.fn()
      } as any as TaskDocument;

      mockedTasksModel.findById.mockResolvedValue(mockedTaskDocument);

      try {
        await service.update(userId, taskId, { status: TaskStatus.Done });

        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
