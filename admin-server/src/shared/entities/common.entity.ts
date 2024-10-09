import {
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class Common {
  @ObjectIdColumn()
  _id: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({
    default: false,
    select: false,
  })
  isDelete: boolean;

  @VersionColumn({ select: false })
  version: number;
}
