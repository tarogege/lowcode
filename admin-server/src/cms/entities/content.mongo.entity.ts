import { ObjectId } from 'mongodb';
import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Content extends Common {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  type: string;

  @Column()
  userId?: ObjectId;

  @Column()
  thumbnail?: object;
}
