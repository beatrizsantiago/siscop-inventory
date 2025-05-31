import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import { DocumentSnapshot } from 'firebase/firestore';

class GetAllPaginatedInventoryUseCase {
  constructor(private repository: InventoryRepository) {}

  async execute(lastDoc?: DocumentSnapshot) {
    const list = await this.repository.getAllPaginated(lastDoc);
    return list;
  };
};

export default GetAllPaginatedInventoryUseCase;
