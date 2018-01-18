export class ZingChart {
  id: string;
  data: object;
  height: any;
  width: any;

  constructor (config: object) {
    this.id = config['id'];
    this.data = config['data'];
    this.height = config['height'] || '100%';
    this.width = config['width'] || '100%';
  }
}
