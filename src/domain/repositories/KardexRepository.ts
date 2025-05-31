import Kardex from '@domain/entities/Kardex';

export interface KardexRepository {
  getByFarmProductState(farmId: string, productId: string, state: string): Promise<Kardex | null>;
  updateAmount(id: string, amount: number): Promise<void>;
  create(kardex: Kardex): Promise<void>;
};
