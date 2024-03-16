import { PickType } from '@nestjs/swagger';
import { Material } from '../schema';

export class AddMaterialReq extends PickType(Material, [
    'title',
]) {
    readonly title: Material['title'];
}