type Item = {
  product_id: string;
  amount: number;
}

class Inventory {
  id: string;
  farm_id: string;
  farm_name: string;
  items: Item[];
  state: string;
  created_at: Date;

  constructor(id: string, farm_id: string, farm_name: string, items: Item[], state: string, created_at: Date) {
    this.id = id;
    this.farm_id = farm_id;
    this.farm_name = farm_name;
    this.items = items;
    this.state = state;
    this.created_at = created_at;
  };
};

export default Inventory;
