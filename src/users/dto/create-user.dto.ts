import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  username: string;
  email: string;
  password: string;
}
