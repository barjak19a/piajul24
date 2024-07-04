export class Table {
  x!: number;
  y!: number;
  radius!: number;
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

export class Restaurant {
    name: string = "";
    address: string = "";
    type: string = "";
    map!: Map;
}
