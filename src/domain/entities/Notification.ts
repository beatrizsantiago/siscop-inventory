class Notification {
  id: string;
  farm_name: string;
  kind: string;
  created_at: Date;

  constructor(id: string, kind: string, farm_name: string, created_at: Date) {
    this.id = id;
    this.kind = kind;
    this.farm_name = farm_name;
    this.created_at = created_at;
  };
};

export default Notification;
