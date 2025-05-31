import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import { KardexRepository } from '@domain/repositories/KardexRepository';
import Inventory from '@domain/entities/Inventory';
import Kardex from '@domain/entities/Kardex';
import Farm from '@domain/entities/Farm';

type InventoryParams = {
  farm: Farm;
  items: Inventory['items'];
  state: string;
};

class AddInventoryUseCase {
  constructor(
    private inventoryRepository: InventoryRepository,
    private kardexRepository: KardexRepository
  ) {}

  async execute(params: InventoryParams): Promise<Inventory> {
    const inventory = new Inventory(
      '',
      params.farm,
      params.items,
      params.state,
      new Date()
    );

    for (const item of inventory.items) {
      const farmId = inventory.farm.id;
      const productId = item.product.id;
      const targetState = inventory.state;
      const amount = item.amount;

      let originState: 'WAITING' | 'IN_PRODUCTION' | null = null;
      if (targetState === 'IN_PRODUCTION') originState = 'WAITING';
      if (targetState === 'READY') originState = 'IN_PRODUCTION';

      if (originState) {
        const originKardex = await this.kardexRepository.getByFarmProductState(farmId, productId, originState);
        if (!originKardex || originKardex.amount < amount) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
        }

        await this.kardexRepository.updateAmount(originKardex.id, originKardex.amount - amount);
      }

      const currentKardex = await this.kardexRepository.getByFarmProductState(farmId, productId, targetState);
      if (currentKardex) {
        await this.kardexRepository.updateAmount(currentKardex.id, currentKardex.amount + amount);
      } else {
        const newKardex = new Kardex('', farmId, productId, targetState, amount);
        await this.kardexRepository.create(newKardex);
      }
    }

    return await this.inventoryRepository.add(inventory);
  }
}

export default AddInventoryUseCase;
