import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { mockUser } from '../../test/utils/mock-user';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fn: create', () => {
    it('should create a new user', async () => {
      const user = mockUser;
      mockRepository.create.mockReturnValue(user);
      const userCreated = await service.create(user);
      expect(userCreated).toMatchObject(user);
    });
  });

  describe('fn: findAll', () => {
    it('should have two users', async () => {
      const user = mockUser;
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAll();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('fn: findOne', () => {
    it('should find a existent user', async () => {
      const user = mockUser;
      mockRepository.findOneOrFail.mockReturnValue(user);
      const userFound = await service.findOne(123);

      expect(userFound).toMatchObject({
        id: 123,
        username: user.username,
        email: user.email,
        password: user.password,
      });
      expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw error if user does not exist', async () => {
      await expect(service.findOne).rejects.toThrowError();
    });
  });

  describe('fn: update', () => {
    it('should update a existent user', async () => {
      const user = mockUser;
      const updatedUser = { username: 'Nome Atualizado' };
      mockRepository.findOneOrFail.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.update(1, {
        ...user,
        username: 'Nome Atualizado',
      });

      expect(resultUser).toMatchObject(updatedUser);
    });
  });

  describe('fn: remove', () => {
    it('should remove a existent user', async () => {
      const user = mockUser;
      mockRepository.findOneOrFail.mockReturnValue(user);
      const removedUser = await service.remove(1);
      expect(removedUser).toMatchObject(user);
    });
  });
});
