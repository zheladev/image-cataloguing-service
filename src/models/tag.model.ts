import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
class Tag {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: true })
  public name: string;
}

export default Tag;