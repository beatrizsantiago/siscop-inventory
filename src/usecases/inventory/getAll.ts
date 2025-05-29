import { InventoryRepository } from '@domain/repositories/InventoryRepository';

class GetAllInventoryUseCase {
  constructor(private repository: InventoryRepository) {}

  async execute() {
    const list = await this.repository.getAll();
    return list;
  };
};

export default GetAllInventoryUseCase;
