import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_old_passwords')
export class UserOldPasswords {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  password: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @ManyToOne(() => Users, (user) => user.activity)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
