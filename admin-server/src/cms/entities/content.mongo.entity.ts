import { ObjectId } from 'mongodb';
import { Common } from 'src/shared/entities/common.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Content extends Common {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  type: string;

  @Column()
  userId?: ObjectId;
}
