import { useState } from 'react';
import { Button } from 'antd';
import { lotteries } from './config/config';
import './App.css';
import { LotteryType, UserType } from './types';
import * as XLSX from 'xlsx';

function App() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [luckyUsers, setLuckyUsers] = useState<UserType[]>([]);
  const [currentLottery, setCurrentLottery] = useState<LotteryType>(lotteries[lotteries.length - 1]);
  const [isShowImport, setIsShowImport] = useState(true);
  const [isLottering, setIsLottering] = useState(false);

  // 读取excel文件
  const readExcel = (file: File) => {
    // 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      // 读取完成
      const data = e.target?.result;
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = XLSX.read(data, { type: 'binary' });
      // 存储获取到的数据
      const result: any[] = [];
      // 遍历每张工作表进行读取（这里默认只读取第一张表）
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
          result.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      // 设置数据
      setAllUsers(result[0]);
    };
    // 以二进制方式打开文件
    reader.readAsBinaryString(file);
  }

  const handleImport = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      readExcel(file);
      setIsShowImport(false);
    }
  }

  const lotteryAlgorithm = (allUsersArr: UserType[], num: number, specialUsers: UserType[]) => {
    let result = [];
    let tempUsersArr = [...allUsersArr];
    // 添加specialUsers到result
    result = [...specialUsers];
    // 获取specialUsers的id
    const specialUsersIdArr = specialUsers.map(user => user.id);
    // 过滤掉arrUsers中的specialUsers
    tempUsersArr = tempUsersArr.filter(user => !specialUsersIdArr.includes(user.id));

    for (let i = 0; i < num - specialUsers.length; i++) {
      let random = Math.floor(Math.random() * allUsersArr.length);
      result.push(allUsersArr[random]);
      tempUsersArr.splice(random, 1);
    }

    setAllUsers([...tempUsersArr]);
    return result;
  }

  const handleLottery = () => {
    const result = lotteryAlgorithm(allUsers, lotteries[0].numberPerLottey, lotteries[0].specialUsers);
    setLuckyUsers(result);
  }

  return (
    <div className="App">
      {isShowImport && <div className='import-data'>
        <input type="file" onChange={handleImport} />
      </div>}
      {!isShowImport && <div className='content'>
        <h1>当前抽奖：{currentLottery.title}</h1>
        <h2>奖品：{currentLottery.description}</h2>
        {isLottering && <div>抽奖中。。</div>}
        {!isLottering && <div className='lucky-users'>
          <h3>恭喜以下顾客中奖：</h3>
          {luckyUsers.map((user, index) => {
            return <div key={index}>{user.nickname}</div>
          })}
        </div>}
        {!isLottering && <Button type="primary" onClick={() => {
          setIsLottering(true);
          handleLottery();
        }}>开始抽奖</Button>}
        {isLottering && <Button type="primary" onClick={() => {
          setIsLottering(false);
        }}>结束抽奖</Button>}
      </div>}
    </div>
  )
}

export default App;
