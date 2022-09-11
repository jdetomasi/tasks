import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { MongoMemoryServerHelper } from '../common/tests/mongo-memory-server.helper';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument, TaskSchema } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const stubTask = (userId: Types.ObjectId): Partial<TaskDocument> => ({
  userId,
  title: 'test title',
  description: 'test description',
  status: TaskStatus.Todo,
});

describe('TasksController - Integration Test ', () => {
  let mongoMemoryServerHelper: MongoMemoryServerHelper;
  let taskModel: Model<TaskDocument>;

  let controller: TasksController;

  beforeAll(async () => {
    // Setup and connect to mongodb in-memory server
    mongoMemoryServerHelper = await MongoMemoryServerHelper.start();

    taskModel = mongoMemoryServerHelper.getModelFromMongoMemoryServer(
      Task.name,
      TaskSchema,
    ) as Model<TaskDocument>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
      controllers: [TasksController],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(async () => {
    await mongoMemoryServerHelper.dropAllData();
  });

  afterAll(async () => {
    await mongoMemoryServerHelper.stop();
  });

  describe('create', () => {
    it('should create new task', async () => {
      const user = {
        userId: new Types.ObjectId(),
      };
      const createTaskDto: CreateTaskDto = {
        title: 'finish tests',
        description: 'finish code challenge unit/integration tests',
        status: TaskStatus.InProgress,
      };

      // create task
      await controller.create(user, createTaskDto);

      // retrieve task
      const tasks: TaskDocument[] = await taskModel.find({
        userId: user.userId,
      });

      // validate saved task data
      expect(tasks.length).toBe(1);
      expect(tasks[0]).toMatchObject(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should find all user tasks', async () => {
      const user1 = {
        userId: new Types.ObjectId(),
      };
      const user2 = {
        userId: new Types.ObjectId(),
      };

      // Create some tasks
      await taskModel.create([
        stubTask(user1.userId),
        stubTask(user1.userId),
        stubTask(user2.userId),
      ]);

      // Get all tasks from user
      const user1Tasks = await controller.findAll(user1);

      // Validate results
      expect(user1Tasks.length).toBe(2);
      expect(user1Tasks[0].title).toBe('test title');
      expect(user1Tasks[0].description).toBe('test description');
      expect(user1Tasks[0].status).toBe(TaskStatus.Todo);
    });
  });

  describe('update', () => {
    it('should update task status', async () => {
      const user = {
        userId: new Types.ObjectId(),
      };

      // Create task
      const task: TaskDocument = await taskModel.create(stubTask(user.userId));

      // Update task status
      await controller.update(user, task._id, {
        status: TaskStatus.Done,
      });

      // Retrieve updated task
      const updatedTask: Task = await taskModel.findById(task._id);

      // Validate results
      expect(task.status).not.toBe(updatedTask.status);
      expect(updatedTask.status).toBe(TaskStatus.Done);
    });
  });
});
