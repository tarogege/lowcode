import { Common } from 'src/shared/entities/common.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends Common {
  @Column('text')
  name: string;

  @Column({ length: 200 })
  email: string;

  @Column()
  password: string;

  @Column({ select: false })
  salt: string;
}
