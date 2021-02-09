export class Device {
  name: string;
  image: string;
  overview: string[];
  material: [{
      image: string;
      name: string;
      text: string;
  }];
  checklist: string[];
  workflows: [{
    name: string;
    steps: [{
      image: string;
      test: string;
    }]
  }];
  manual: [{
    link: string;
  }];
  signs: [{
    name: string;
    image: string
  }];
}
