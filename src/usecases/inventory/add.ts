import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import Inventory from '@domain/entities/Inventory';
import Farm from '@domain/entities/Farm';

type InventoryParams = {
  farm: Farm,
  items: Inventory['items'],
  state: string;
}

class AddInventoryUseCase {
  constructor(private repository: InventoryRepository) {}

   async execute(inventory: InventoryParams) {
    const data = new Inventory(
      '',
      inventory.farm,
      inventory.items,
      inventory.state,
      new Date(),
    );
  
    return await this.repository.add(data);
  }
};

export default AddInventoryUseCase;
