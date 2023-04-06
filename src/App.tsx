import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Image, Spin, Drawer, Affix, Alert, Badge } from "antd";
import { lotteries } from "./config/config";
import { LotteryType, UserType, luckyUsersType } from "./types";
import * as XLSX from "xlsx";
import { prizePics } from "./utli";
import "./App.css";

function App() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [luckyUsers, setLuckyUsers] = useState<luckyUsersType[]>([]);
  const [currentLottery, setCurrentLottery] = useState<LotteryType>(
    lotteries[lotteries.length - 1]
  );
  const [remainTimes, setRemainTimes] = useState(0);
  const [currentTimeLuckyUsers, setCurrentTimeLuckyUsers] = useState<
    UserType[]
  >([]);
  const [ShowImport, setShowImport] = useState(true);
  const [isLottering, setIsLottering] = useState(false);
  const [showLuckUsers, setShowLuckUsers] = useState(false);
  const [showAllLuckyUsers, setshowAllLuckyUsers] = useState(false);

  useEffect(() => {
    setRemainTimes(getLotteryTimes());
  }, [currentLottery]);

  const showDrawer = () => {
    setshowAllLuckyUsers(true);
  };

  const onClose = () => {
    setshowAllLuckyUsers(false);
  };

  // 读取excel文件
  const readExcel = (file: File) => {
    // 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      // 读取完成
      const data = e.target?.result;
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = XLSX.read(data, { type: "binary" });
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
      setShowImport(false);
    };
    // 以二进制方式打开文件
    reader.readAsBinaryString(file);
  };

  // 获取currentLottery在lotteries中的index
  const getCurrentLotteryIndex = () => {
    return lotteries.findIndex(
      (lottery) => lottery.type === currentLottery.type
    );
  };

  // 定义获取抽奖次数方法，通过currentLottery.amount和currentLottery.amountPerTime计算
  const getLotteryTimes = () => {
    const lotteryTimes = Math.floor(
      currentLottery.amount / currentLottery.amountPerTime
    );
    const remainder = currentLottery.amount % currentLottery.amountPerTime;
    return remainder === 0 ? lotteryTimes : lotteryTimes + 1;
  };

  const lotteryAlgorithm = (
    allUsersArr: UserType[],
    num: number,
    specialUsers: UserType[]
  ) => {
    let result: UserType[] = [];
    let tempUsersArr = [...allUsersArr];
    let length = num;
    if (remainTimes === getLotteryTimes()) {
      result = [...specialUsers];
      length = num - specialUsers.length;
    }
    // 获取specialUsers的id
    const specialUsersIdArr = specialUsers.map((user) => user.id);
    // 过滤掉arrUsers中的specialUsers
    tempUsersArr = tempUsersArr.filter(
      (user) => !specialUsersIdArr.includes(user.id)
    );

    for (let i = 0; i < length; i++) {
      let random = Math.floor(Math.random() * allUsersArr.length);
      result.push(allUsersArr[random]);
      tempUsersArr.splice(random, 1);
    }

    setAllUsers([...tempUsersArr]);
    return result;
  };

  const handleLottery = () => {
    const result = lotteryAlgorithm(
      allUsers,
      currentLottery.amountPerTime,
      currentLottery.specialUsers
    );
    let tempLuckyUsers = luckyUsers.slice();
    let currentTypeIndex = tempLuckyUsers.findIndex(
      (luckyUser) => luckyUser.type === currentLottery.type
    );
    if (currentTypeIndex === -1) {
      tempLuckyUsers = [
        ...tempLuckyUsers,
        {
          type: currentLottery.type,
          users: result,
        },
      ];
    } else {
      tempLuckyUsers[currentTypeIndex].users = [
        ...tempLuckyUsers[currentTypeIndex].users,
        ...result,
      ];
    }

    setLuckyUsers([...tempLuckyUsers]);
    setCurrentTimeLuckyUsers(result);
  };

  return (
    <div className="App">
      {ShowImport && (
        <div className="import-data">
          <Upload
            name="excel"
            action=""
            accept="file"
            beforeUpload={readExcel}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传数据</Button>
          </Upload>
        </div>
      )}
      {!ShowImport && (
        <div className="content">
          <h1>当前抽奖：{currentLottery.title}</h1>
          <h2>奖品：{currentLottery.description}</h2>
          <div className="prize-pic-container">
            <Badge count={currentLottery.amount}>
              <Image
                className="prize-pic"
                width={200}
                src={prizePics[getCurrentLotteryIndex()]}
              />
            </Badge>
          </div>
          {isLottering && (
            <div className="lottery-animation-container">
              {" "}
              <Spin size="large" spinning={isLottering}>
                抽奖中。。
              </Spin>
            </div>
          )}
          {!isLottering && showLuckUsers && (
            <div className="lucky-users">
              <h3>恭喜以下顾客中奖：</h3>
              {currentTimeLuckyUsers.map((user, index) => {
                return <div key={index}>{user.nickname}</div>;
              })}
            </div>
          )}
          {!isLottering && (
            <Button
              type="primary"
              onClick={() => {
                setIsLottering(true);
                handleLottery();
                setRemainTimes(remainTimes - 1);
                setShowLuckUsers(false);
              }}
              disabled={remainTimes === 0}
            >
              开始抽奖
            </Button>
          )}
          {isLottering && (
            <Button
              type="primary"
              onClick={() => {
                setIsLottering(false);
                setShowLuckUsers(true);
              }}
            >
              结束抽奖
            </Button>
          )}
          <div className="rest-times">
            剩余抽奖次数：<strong>{remainTimes}</strong>
          </div>

          {!isLottering && remainTimes === 0 && (
            <div className="next-lottery-button">
              <Button
                type="primary"
                onClick={() => {
                  if (getCurrentLotteryIndex() !== 0) {
                    setCurrentLottery(lotteries[getCurrentLotteryIndex() - 1]);
                  }
                  setShowLuckUsers(false);
                }}
                disabled={getCurrentLotteryIndex() === 0}
              >
                开始下一奖项抽奖
              </Button>
            </div>
          )}
        </div>
      )}
      <Drawer
        title="获奖名单"
        placement="right"
        onClose={onClose}
        open={showAllLuckyUsers}
      >
        {lotteries
          .slice()
          .reverse()
          .map((lottery, index) => {
            return (
              <div key={lottery.type}>
                <h3>{lottery.title}</h3>
                {luckyUsers[index]?.users.map((user, index) => {
                  return <div key={index}>{user.nickname}</div>;
                })}
              </div>
            );
          })}
      </Drawer>
      <div className="top-buttons">
        <Affix offsetTop={10}>
          <Button type="primary" onClick={showDrawer}>
            获奖名单
          </Button>
        </Affix>
      </div>
    </div>
  );
}

export default App;
