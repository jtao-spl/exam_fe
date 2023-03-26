import { PaginationProps } from 'antd';
import React, { useRef, useState } from 'react'
import { ITeacherTableItem } from '../../interfaces/Exam';
import * as XLSX from 'xlsx';

export default function Download() {
    const buttonRef = useRef<any>(null);
    const tableRef = useRef<any>(null);
    const [tableData, setTableData] = useState<ITeacherTableItem[]>([]);

    // 按钮loading
    const [downLoading, setDownLoading] = useState<boolean>(false);

    const init = async () => {
        //拿到tabledata
    }


    return (
        <div>Download</div>
    )
}

// ////这里的数据是用来定义导出的格式类型
// const wopts:XLSX.WritingOptions = { bookType: 'xlsx', bookSST: true, type: "binary" };
// function downloadExcel(data, type) {
//     var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
//     // wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);//通过json_to_sheet转成单页(Sheet)数据
//     data = xlsxUtils.format2Sheet(data);
//     data["B1"] = { t: "s", v: "asdad" };
//     data["!merges"] = [{//合并第一行数据[B1,C1,D1,E1]
//         s: {//s为开始
//             c: 1,//开始列
//             r: 0//开始取值范围
//         },
//         e: {//e结束
//             c: 4,//结束列
//             r: 0//结束范围
//         }
//     }];
//     wb = xlsxUtils.format2WB(data, 'Sheet1');
//     // data["!ref"]="A1:E7";
//     // wb.Sheets['Sheet1'] = data;
//     saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "这里是下载的文件名" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
// }

// //字符串转buffer
// function s2ab(s: string) {
//     var buf = new ArrayBuffer(s.length);
//     var view = new Uint8Array(buf);
//     for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//     return buf;
// }

// /**
//      * @desc 格式化数据为Sheet格式
//      * @param {Array} json 数据
//      * @param {Number} n 列偏移
//      * @param {Number} r 行偏移
//      * @param {Array} keyMap 对象键数组
//      * @param {Function|Boolean} t 数据
//      */
// const format2Sheet = (json: any[], n:number, r:number, keyMap:string, t: any) => {
//     keyMap = keyMap || Object.keys(json[0]);
//     n = n || 0;
//     r = r || 0;
//     var tmpdata = {};//用来保存转换好的json 
//     var t1 = json.map((v, i) => keyMap.map((k:string, j:number) => Object.assign({}, {
//         v: v[k],
//         position: ((j + n) > 25 ? xlsxUtils.getCharCol((j + n)) : String.fromCharCode(65 + (j + n))) + (i + 1 + r),
//     }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
//         v: v.v,
//         t: types?types(v.v):"s"
//     });
//     return tmpdata;
// }