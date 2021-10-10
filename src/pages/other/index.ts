interface RegionInfo {
  type: string;
  code: number[];
}
interface JoinLimit {
  region: number;
  regionInfo: RegionInfo;
  [propName: string]: any;
}

const joinLimit :JoinLimit = {
  region: 12,
  regionInfo: {
    type: 'default',
    code: [0, 0]
  },
  group: 101
}

console.log(joinLimit)

export const sum = (a:number, b:number) => {
  return a + b
}
