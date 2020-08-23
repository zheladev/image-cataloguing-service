import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.model';
import Tag from './tag.model';

@Entity()
class Image {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public path: string;

  @ManyToMany(type => Tag)
  @ManyToOne(type => User, user => user.images)
  public tags: Array<Tag>;

  public user: User;
}

export default Image;