class Kardex {
  id: string;
  farm_id: string;
  product_id: string;
  state: string;
  amount: number;

  constructor(id: string, farm_id: string, product_id: string, state: string, amount: number) {
    this.id = id;
    this.farm_id = farm_id;
    this.product_id = product_id;
    this.state = state;
    this.amount = amount;
  };
};

export default Kardex;
