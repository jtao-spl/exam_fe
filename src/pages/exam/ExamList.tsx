import { Button, message, Popconfirm, Space, Table, TableColumnsType } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getExamList, setExamStatusApi } from '../../api/exam'
import { IExam, sizeScopeToDelta } from '../../interfaces/Exam'
import { ISize } from '../../interfaces/Size'
import { getSizesByComponentId } from '../../wrapper/Component'
import { generateExamTableColomns, getCalculatedSizeForExam } from '../../wrapper/Exam'
import ShowSizeList from '../component/ShowSizeList'
import PublishExam from './PublishExam'


interface IProps {
    exams?: IExam[],
    total: number,
    pageSize: number,
    loading: boolean,
    callback: () => void,
    pageChangeCallback: (page: number) => void
}


export default function ExamList() {

    const [exams, setExams] = useState<IExam[]>([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [loading, setLoading] = useState(true);
    const getList = async (pg: number = 1, lim: number = 10, ExamComponent: number = 0) => {
        const res = await getExamList(pg, lim, ExamComponent);
        if(res){
            setExams(res.exams);
            setTotal(res.total);
            setPageSize(res.pageSize);
            setLoading(false);
        }
    }
    useEffect(() => {
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


function ExamTable(props: IProps) {
    const { exams, total, pageSize, loading, callback, pageChangeCallback } = props;
    const [showSizeList, setShowSizeList] = useState(false);
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [currentExam, setCurrentExam] = useState<IExam>();

    const navigate = useNavigate()

    const initSizeList = async (exam: IExam, showList: boolean = true) => {
        const sizes = await getSizesByComponentId(exam.ExamComponent);
        const calculatedSize = getCalculatedSizeForExam(exam, sizes, sizeScopeToDelta);
        setShowSizeList(showList);
        setSizeList(calculatedSize);

    }
    const hideShowSizeList = (refresh?: boolean) => {
        setShowSizeList(false);
    }

    const setExamStatus = async (exam: IExam, status: number) => {
        const res = await setExamStatusApi(exam.Id, status);
        if(!res) return;
        callback()
    }

    const generateTableColumns = () => {
        const columns: TableColumnsType<IExam> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space direction='vertical'>

                        <Button type='primary' key={"viewSize"}
                            onClick={() => initSizeList(exam)}
                        >查看尺寸数据</Button>
                        <Button type="primary" disabled={exam.Status !== 0}
                            onClick={() => { navigate('/teacher/exam/demo', { state: { id: exam.Id } }) }}
                        >教师展示</Button>
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
                onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
                loading={loading}
            />}
        </div>
    )

}
