import Inventory from '@domain/entities/Inventory';

export interface InventoryRepository {
  add(inventory: Inventory): Promise<Inventory>;
  getAll(): Promise<Inventory[]>;
};
