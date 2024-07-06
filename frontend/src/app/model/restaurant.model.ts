export class Table {
  _id?: string;
  x!: number;
  y!: number;
  radius!: number;
  status?: string;
}

export class Rectangle {
  x!: number;
  y!: number;
  width!: number;
  height!: number;
}

export class Map {
  tables!: Table[];
  bathrooms!: Rectangle[];
  kitchens!: Rectangle[];
}

export class WorkingHours {
  start: string = "";
  end: string = "";
}

export class Restaurant {
    name: string = "";
    address: string = "";
    type: string = "";
    description: string = "";
    contact: string = "";
    workingHours: WorkingHours = new WorkingHours();
    map!: Map;
}
