import { Button, message, Popconfirm, Space, Table, TableColumnsType, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { Outlet, useNavigate } from 'react-router-dom'
// import { getComponentCriteriaTypes } from '../../api/comp'
import { getExamList, setExamStatusApi } from '../../api/exam'
import { getSizeCountByComponentId, getSizeList } from '../../api/size'
import ShowSizeList from '../component/ShowSizeList'
import { ISize } from '../size/SizeList'
import { ExamStatus2Desc } from '../student/Exam'
import PublishExam from './PublishExam'
// import Criteria, { GelToleranceSymbol, IEntityRequired, SizedElementSymbol } from './Criteria'
// import Standard from './Standard'
export interface ScoreItem {
    Score: number,
    SizeId: number
}
export interface IExam {
    Id: number,
    ExamDate: Date,
    StartTime: string,
    FinishTime: string,
    ExamTarget: string,
    ExamComponent: number,
    SizePrecisionLevel: number,
    ExamTeacher: string,
    CriteriaId: number,
    Status: number, //0 初始状态 1 已下发 2 已收卷
    Data?: { scores: ScoreItem[] }
}

interface IProps {
    exams?: IExam[],
    total: number,
    pageSize: number,
    loading: boolean,
    callback: () => void,
    pageChangeCallback: (page: number) => void
}


export default function ExamList() {

    const [exams, setExams] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [loading, setLoading] = useState(true);
    const getList = async (pg: number = 1, lim: number = 10, ExamComponent: number = 0) => {
        const res = await getExamList(pg, lim, ExamComponent);
        const { code, msg, data, total, limit } = res.data;
        if (code !== 0) {
            message.error(`获取考核列表失败，系统错误：${msg}`);
            return;
        }
        setExams(data);
        setTotal(total);
        setPageSize(limit);
        setLoading(false);

    }
    useEffect(() => {
        console.log(`初始化获取exam list in useEffect`);
        getList();
    }, []);

    return (
        <div>
            <ExamTable
                exams={exams}
                total={total}
                pageSize={pageSize}
                loading={loading}
                callback={() => getList()}
                pageChangeCallback={(page: number) => getList(page)}
            />
        </div>
    )
}

interface DataType extends IExam {
    key: React.Key,
}
export function generateExamTableColomns() {
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
        },
        {
            title: '考核状态', key: 'ExamStatus', render: (_: any, exam: IExam) => {

                return <Tag>{ExamStatus2Desc.get(exam.Status)}</Tag>
            }
        }
    ]
    return columns;
}
export const sizeScopeToDelta: number[][] = [
    [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, NaN],
    [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2],
    [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4],
    [NaN, 0.5, 1, 1.5, 2.5, 4, 6, 8]
];

export function getPricisionLevelIndexBySize(size: number) {
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

export function getCalculatedSizeForExam(exam: IExam, sizes: ISize[], sizeScopeToDelta: number[][]) {
    const { SizePrecisionLevel } = exam;

    const newSize = sizes.map(size => {
        //非尺寸数据直接返回
        if (size.FirstType !== 0 || !size.BaseSize) {
            return size
        }
        //上下delta有一个不为0 直接返回
        if ((size.UpSize && size.UpSize * 1000 > 0) || (size.BottomSize && size.BottomSize * 1000 > 0)) {
            return size;
        }
        let temp = { ...size };
        const idx = getPricisionLevelIndexBySize(size.BaseSize);

        const delta = sizeScopeToDelta[SizePrecisionLevel][idx];
        temp.UpSize = delta;
        temp.BottomSize = -delta;
        return temp;
    })
    return newSize;

}

function ExamTable(props: IProps) {
    const { exams, total, pageSize, loading, callback, pageChangeCallback } = props;
    const [showSizeList, setShowSizeList] = useState(false);
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [currentExam, setCurrentExam] = useState<IExam>();

    const navigate = useNavigate()

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

    const setExamStatus = async (exam: IExam, status: number) => {
        const res = await setExamStatusApi(exam.Id, status);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`操作失败，系统错误:${msg}`);
            return
        }
        message.success(`操作成功`)
        callback()
    }

    const generateTableColumns = () => {
        const columns: TableColumnsType<any> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space direction='vertical'>

                        <Button type='primary' key={"viewSize"}
                            onClick={() => initSizeList(exam)}
                        >查看尺寸数据</Button>
                        <Button disabled={exam.Status !== 0} type="primary" onClick={() => {
                            setCurrentExam(exam);
                            setShowPublishModal(true);
                        }}>下发考核</Button>
                        <Popconfirm disabled={exam.Status !== 1}
                            title="收卷后考核学生不可继续提交，确认收卷？"
                            onConfirm={() => setExamStatus(exam, 2)}
                            onCancel={() => { message.info(`取消收卷成功`) }}
                        >
                            <Button disabled={exam.Status !== 1} type="primary">收卷</Button>
                        </Popconfirm>
                        <Button type='primary' disabled={exam.Status !== 2} onClick={() => navigate(`/teacher/exam/${exam.Id}/scores`)}>
                            教师复测
                        </Button>
                    </Space>)
                }
            }
        ]
        return columns
    }


    return (
        <div>
            <ShowSizeList
                visible={showSizeList}
                cancel={hideShowSizeList}
                sizeList={sizeList}
            />
            {currentExam &&
                <PublishExam
                    visible={showPublishModal}
                    cancel={() => setShowPublishModal(false)}
                    exam={currentExam}
                    callback={() => {
                        setShowPublishModal(false);
                        callback()
                    }}
                />
            }
            {exams && <Table
                rowKey={record => record.Id}
                dataSource={exams}
                columns={generateTableColumns()}
                pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
                scroll={{ y: 400 }}
                onChange={(pagenation:any)=>pageChangeCallback(pagenation.current)}
                loading={loading} 
                />}
        </div>
    )

}
