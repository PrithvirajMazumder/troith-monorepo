import { Injectable } from '@nestjs/common';
import { CreateChallanInput } from './dto/create-challan.input';
import { UpdateChallanInput } from './dto/update-challan.input';

@Injectable()
export class ChallansService {
  create(createChallanInput: CreateChallanInput) {
    return 'This action adds a new challan';
  }

  findAll() {
    return `This action returns all challans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} challan`;
  }

  update(id: number, updateChallanInput: UpdateChallanInput) {
    return `This action updates a #${id} challan`;
  }

  remove(id: number) {
    return `This action removes a #${id} challan`;
  }
}
