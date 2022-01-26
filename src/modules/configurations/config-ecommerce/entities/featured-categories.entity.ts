import { Category } from "src/modules/products/categories/entities/category.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categoria_destacada')
export class FeaturedCategory{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    imagen: string;

    @Column({nullable:true})
    subtitulo: string;

    @OneToOne(() => Category)
    @JoinColumn({name:'categoria_id'})
    categoria:Category;
}