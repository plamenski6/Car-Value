import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) =>
        Promise.resolve({
          id,
          email: 'plamen@abv.bg',
          password: '123456',
        } as User),
      findAllWithCurrentCriteria: (email: string) =>
        Promise.resolve([{ id: 1, email, password: '123456' } as User]),
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      //   signup: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findUsersWithCurrentCriteria(
      'asdf@asdf.com',
    );
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUserById returns a user with the given id', async () => {
    const user = await controller.findUserById('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  //   it('findUser throws an error if user with given id is not found', async () => {
  //     fakeUsersService.findOneById = () => null;
  //     await expect(controller.findUserById('1')).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signinUser(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
