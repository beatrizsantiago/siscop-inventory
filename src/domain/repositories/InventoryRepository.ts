import Inventory from '@domain/entities/Inventory';

export interface InventoryRepository {
  getAll(): Promise<Inventory[]>;
};
