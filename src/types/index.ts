export interface LotteryType {
  // 奖品类型
  type: string;
  // 奖品数量
  amount: number;
  // 每次抽奖数量（人数）
  numberPerLottey: number;
  // 奖品名称
  title: string;
  // 奖品描述
  description: string;
  // 奖品图片
  picture: string;
  // 指定中奖人员,指定人数不能超过奖品数量，否则按顺序截取, 如果不指定则全部随机抽取
  specialUsers: UserType[];
}

export interface UserType {
  id: string;
  name: string;
  nickname: string;
}