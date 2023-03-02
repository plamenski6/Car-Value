import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      findAllWithCurrentCriteria: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('asd@asd.com', 'asd');

    expect(user.password).not.toEqual('asd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signup with email that is in use', async () => {
    // fakeUsersService.findAllWithCurrentCriteria = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if an invalid password is provided for signin', async () => {
    // fakeUsersService.findAllWithCurrentCriteria = () =>
    //   Promise.resolve([
    //     { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
    //   ]);

    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided for signin', async () => {
    // fakeUsersService.findAllWithCurrentCriteria = () =>
    //   Promise.resolve([
    //     {
    //       email: 'plamen@abv.bg',
    //       password:
    //         'dd911fc786ccd07b.58734e10e1378c00abc85279ab07898a9577c1dba4ff127a73c94e4a1996610f',
    //     } as User,
    //   ]);

    await service.signup('plamen@abv.bg', '123456');

    const user = await service.signin('plamen@abv.bg', '123456');
    expect(user).toBeDefined();
  });
});
