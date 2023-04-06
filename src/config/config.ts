import { LotteryType } from "../types";

/**
 * 抽奖配置
 */
export const lotteries: LotteryType[] = [
  {
    // 奖品类型
    type: "prizeA",
    // 奖品数量
    amount: 3,
    // 每次抽奖人数
    amountPerTime: 3,
    // 奖品名称
    title: "特等奖",
    // 奖品描述
    description: "苹果电脑",
    // 指定中奖人员,指定人数不能超过奖品数量，否则按顺序截取, 如果不指定则全部随机抽取
    specialUsers: [
      {
        id: 'a01',
        name: '张三',
        nickname: 'zhangsan',
      }
    ]
  },
  {
    // 奖品类型
    type: "prizeB",
    // 奖品数量
    amount: 6,
    // 每次抽奖人数
    amountPerTime: 2,
    // 奖品名称
    title: "一等奖",
    // 奖品描述
    description: "苹果手机",
    // 指定中奖人员,指定人数不能超过奖品数量，否则按顺序截取, 如果不指定则全部随机抽取
    specialUsers: [
      {
        id: 'a02',
        name: '王五',
        nickname: 'wangwu',
      }
    ]
  },
  {
    // 奖品类型
    type: "prizeC",
    // 奖品数量
    amount: 20,
    // 每次抽奖人数
    amountPerTime: 10,
    // 奖品名称
    title: "二等奖",
    // 奖品描述
    description: "电子手表",
    // 指定中奖人员,指定人数不能超过奖品数量，否则按顺序截取, 如果不指定则全部随机抽取
    specialUsers: []
  },
];
