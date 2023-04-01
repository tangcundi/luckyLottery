// 定义抽奖算法
export function lotteryAlgorithm (arr: any[], num: number) {
  let result = [];
  for (let i = 0; i < num; i++) {
    let random = Math.floor(Math.random() * arr.length);
    result.push(arr[random]);
    arr.splice(random, 1);  // 从数组中删除已经抽取的元素
  }
  return result;
}