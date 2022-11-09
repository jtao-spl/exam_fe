import { Button, message, Space, Table, TableColumnsType, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getComponentCriteriaTypes } from '../../api/comp'
import { getExamList } from '../../api/exam'
import { getSizeCountByComponentId, getSizeList } from '../../api/size'
import ShowSizeList from '../component/ShowSizeList'
import { ISize } from '../size/SizeList'
import Criteria, { GelToleranceSymbol, IEntityRequired, SizedElementSymbol } from './Criteria'
import Standard from './Standard'
export interface IExam {
    Id: number,
    ExamDate: Date,
    StartTime: string,
    FinishTime: string,
    ExamTarget: string,
    ExamComponent: number,
    SizePrecisionLevel: number,
    ExamTeacher: string
}

interface IProps {
    exams?: IExam[]
}


export default function ExamList() {

    const [exams, setExams] = useState([]);
    const getList = async (pg: number = 1, lim: number = 10, ExamComponent: number = 0) => {
        const res = await getExamList(pg, lim, ExamComponent);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`获取考核列表失败，系统错误：${msg}`);
            return;
        }
        console.log(`get  exams: ${JSON.stringify(data)}`);
        setExams(data);

    }
    useEffect(() => {
        console.log(`初始化获取exam list in useEffect`);
        getList();
    }, []);

    return (
        <div>
            <ExamTable exams={exams} />
        </div>
    )
}

interface DataType extends IExam {
    key: React.Key,
}
function generateExamTableColomns() {
    const columns: TableColumnsType<DataType> = [
        { title: "考核日期", key: 'ExamDate', dataIndex: 'ExamDate' },
        { title: "考核时间", key: 'StartTime', dataIndex: 'StartTime' },
        { title: "交件时间", key: 'FinishTime', dataIndex: 'FinishTime' },
        { title: "考核项目", key: 'ExamTarget', dataIndex: 'ExamTarget' },
        { title: '考核教师', key: 'ExamTeacher', dataIndex: 'ExamTeacher' },
        { title: '考核零件', key: 'ExamComponent', dataIndex: 'ExamComponent' },
        {
            title: '零件精密等级', key: 'SizePrecisionLevel', render: (_: any, exam: IExam) => {
                let level: string;
                switch (exam.SizePrecisionLevel) {
                    case 0:
                        level = "精密f";
                        break;
                    case 1:
                        level = "中等m";
                        break;
                    case 2:
                        level = "粗糙c";
                        break;
                    case 3:
                        level = "最粗v"
                        break;
                    default:
                        level = "未知"
                        break;
                }
                return <Tag>{level}</Tag>
            }
        }
    ]
    return columns;
}
export const sizeScopeToDelta:number[][] = [
    [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, NaN],
    [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2],
    [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4],
    [NaN, 0.5, 1, 1.5, 2.5, 4, 6, 8]
];

export function getPricisionLevelIndexBySize(size: number){
    let idx = -1;
    if (size && size >= 0.5 && size < 3) {
        idx = 0
    }
    else if (size && size >= 3 && size < 6) {
        idx = 1
    }
    else if (size && size >= 6 && size < 30) {
        idx = 2
    }
    else if (size && size >= 30 && size < 120) {
        idx = 3
    }
    else if (size && size >= 120 && size < 400) {
        idx = 4
    }
    else if (size && size >= 400 && size < 1000) {
        idx = 5
    }
    else if (size && size >= 1000 && size < 2000) {
        idx = 6
    }
    else if (size && size >= 2000 && size < 4000) {
        idx = 7
    }
    return idx;
}

export function getCalculatedSizeForExam(exam: IExam, sizes: ISize[], sizeScopeToDelta:number[][]){
    const { SizePrecisionLevel } = exam;
   
    const newSize = sizes.map(size => {
        //非尺寸数据直接返回
        if (size.FirstType !== 0 || !size.BaseSize) {
            return size
        }
        //上下delta有一个不为0 直接返回
        if(size.UpSize && size.UpSize * 1000 > 0 || (size.BottomSize && size.BottomSize * 1000 > 0)){
            return size;
        }
        let temp = { ...size };
        const idx= getPricisionLevelIndexBySize(size.BaseSize);
        
        const delta = sizeScopeToDelta[SizePrecisionLevel][idx];
        temp.UpSize = delta;
        temp.BottomSize = -delta;
        return temp;
    })
    return newSize;

}

function ExamTable(props: IProps) {
    const { exams } = props;
    const [showSizeList, setShowSizeList] = useState(false);
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    const [showCreterialModal, setShowCreterialModal] = useState(false);
    const [ExamComponent, setExamComponent] = useState(0);
    const [currentExamId, setCurrentExam] = useState(0);
    const [showStandardModal, setShowStandardModal] = useState(false);


    const initSizeList = async (exam: IExam, showList: boolean = true) => {
        const c = await getSizeCountByComponentId(exam.ExamComponent);
        let { code, msg, data } = c.data;
        if (code !== 0) {
            message.error(`请求失败，系统错误:${msg}`);
            return;
        }
        const res = await getSizeList(1, data.count, exam.ExamComponent);
        if (res.data.code !== 0) {
            message.error(`请求失败，系统错误:${res.data.msg}`);
            return;
        }
        const sizeList = res.data.data;
        sizeList.map((size: ISize) => {
            size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
            return size
        })
        const calculatedSize = getCalculatedSizeForExam(exam, sizeList, sizeScopeToDelta);
        setShowSizeList(showList);
        setSizeList(calculatedSize);

    }
    const hideShowSizeList = (refresh?: boolean) => {
        setShowSizeList(false);
    }
    const displayCreterialModal = (exam: IExam) => {
        setShowCreterialModal(true);
        setExamComponent(exam.ExamComponent);
        setCurrentExam(exam.Id);

    }
    const displaySetStandardModal = async (exam: IExam) => {
        setShowStandardModal(true);
        setCurrentExam(exam.Id);
    }
    const hiddenStandardModal = () => {
        setShowStandardModal(false);
    }
    const generateTableColumns = (examList: any) => {
        const columns: TableColumnsType<DataType> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space>

                        <Button type='primary' key={"viewSize"}
                            onClick={() => initSizeList(exam)}
                        >查看尺寸数据</Button>

                        <Button key={"criteria"} type='primary'
                            onClick={() => displayCreterialModal(exam)}>
                            设置评测标准
                        </Button>
                        <Button key={"standard"} type="primary"
                            onClick={() => displaySetStandardModal(exam)}>
                            设置考核项评分
                        </Button>
                    </Space>)
                }
            }
        ]
        return <Table dataSource={examList} columns={columns} pagination={false} scroll={{ y: 400 }} />
    }


    return (
        <div>
            <ShowSizeList
                visible={showSizeList}
                cancel={hideShowSizeList}
                sizeList={sizeList}
            />
            <Criteria
                visible={showCreterialModal}
                ExamComponent={ExamComponent}
                ExamId={currentExamId}
                cancel={() => setShowCreterialModal(false)}
            />
            <Standard
                visible={showStandardModal}
                ExamId={currentExamId}
                cancel={hiddenStandardModal} />
            {exams && generateTableColumns(exams)}
            <Outlet />
        </div>
    )

}
