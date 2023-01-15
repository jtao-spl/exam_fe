import { Button, message, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getExamList } from '../../api/exam';
import { isExamSubmitted } from '../../api/score';
import { generateExamTableColomns, IExam } from '../exam/ExamList';

export default function Exams() {
    const [exams, setExams] = useState<IExam[]>([]);
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
        const visibleExams = data.filter((exam: IExam) => exam.Status !== 0);
        setExams(visibleExams);
        setTotal(total);
        setPageSize(limit);
        setLoading(false);

    }

    useEffect(() => {
        getList(0, 10)
    }, [])
    return (
        <div>
            <StudentExam
                exams={exams}
                total={total}
                pageSize={pageSize}
                loading={loading}
                pageChangeCallback={(page: number) => getList(page)}
            />
        </div>
    )
}

interface IProps {
    exams: IExam[],
    total: number,
    pageSize: number,
    loading: boolean,
    pageChangeCallback: (page: number) => void
}
export const checkExamSubmitted = async (Id: number) => {
    const res = await isExamSubmitted(Id);
    const { code, data } = res.data;
    if (code !== 0) {
        return false;
    }
    const { isSubmitted } = data;
    return isSubmitted
}


function StudentExam(props: IProps) {
    const navigate = useNavigate();
    const { exams, total, pageSize, loading, pageChangeCallback } = props;

    const viewExam = async (exam: IExam) => {
        const isSubmitted = await checkExamSubmitted(exam.Id);

        if (isSubmitted) {
            navigate(`/student/exam/${exam.Id}/detail`);
        } else {
            navigate(`/student/exam/${exam.Id}`)
        }
    }


    const generateTableColumns = () => {
        const columns: TableColumnsType<any> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space direction='vertical'>

                        <Button type='primary' key={"viewSize"}
                            onClick={() => viewExam(exam)}
                        >查看详情</Button>

                    </Space>)
                }
            }
        ]
        return columns;
    }
    return (<div>
        <Table
            rowKey={record => record.Id}
            dataSource={exams}
            columns={generateTableColumns()}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }}
            onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
            loading={loading} />
    </div>)
}