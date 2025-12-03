declare interface Window {
  point_diy: {
    send_data: (eventName: string, data: string) => void;
  },
  pathFrom: string,
  pathTo: string,
  processDetail: any,
  userList: any,
  threeLevelTaskNode: any,
  keys: any,
  isPc: any
}