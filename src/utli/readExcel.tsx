import * as XLSX from 'xlsx';

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
  };
  // 以二进制方式打开文件
  reader.readAsBinaryString(file);
}

export default readExcel;