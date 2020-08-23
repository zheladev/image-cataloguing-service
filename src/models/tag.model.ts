import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Tag {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;
}

export default Tag;