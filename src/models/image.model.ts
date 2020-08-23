import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.model';
import Tag from './tag.model';
import { IsOptional } from 'class-validator';

@Entity()
class Image {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public path: string;

  @ManyToMany(type => Tag, tag => tag.id)
  @JoinTable()
  @IsOptional()
  public tags?: Array<string>;

  @ManyToOne(type => User, user => user.images)
  public uploader?: User;
}

export default Image;