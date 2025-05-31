import Farm from './Farm';
import Product from './Product';

type Item = {
  product: Product;
  amount: number;
}

class Inventory {
  id: string;
  farm: Farm;
  items: Item[];
  state: string;
  created_at: Date;

  constructor(id: string, farm: Farm, items: Item[], state: string, created_at: Date) {
    this.id = id;
    this.farm = farm;
    this.items = items;
    this.state = state;
    this.created_at = created_at;
  };
};

export default Inventory;
