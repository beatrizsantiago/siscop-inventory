import { DocumentReference, Timestamp } from 'firebase/firestore';

type Item = {
  product_id: DocumentReference,
  amount: number,
};

class Goal {
  id: string;
  kind: string;
  farm_id: string;
  items: Item[];
  finished: boolean;
  created_at: Timestamp;

  constructor(id: string, kind: string, farm_id: string, items: Item[], finished: boolean, created_at: Timestamp) {
    this.id = id;
    this.kind = kind;
    this.farm_id = farm_id;
    this.items = items;
    this.finished = finished;
    this.created_at = created_at;
  }
};

export default Goal;
