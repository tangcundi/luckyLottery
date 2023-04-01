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
    // 每次抽奖数量（人数）
    numberPerLottey: 3,
    // 奖品名称
    title: "特等奖",
    // 奖品描述
    description: "神秘大礼",
    // 奖品图片
    picture: "../img/secrit.jpg",
    // 指定中奖人员,指定人数不能超过奖品数量，否则按顺序截取, 如果不指定则全部随机抽取
    specialUsers: [
      {
        id: '01',
        name: '张三',
        nickname: 'zhangsan',
      }
    ]
  },
];
