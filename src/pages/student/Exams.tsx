import { Button, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getExamList } from '../../api/exam';
import { isExamSubmitted } from '../../api/score';
import { IExam, IStudentExamProps } from '../../interfaces/Exam';
import { generateExamTableColomns } from '../../wrapper/Exam';

export default function Exams() {
    const [exams, setExams] = useState<IExam[]>([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [loading, setLoading] = useState(true);
    const getList = async (pg: number = 1, lim: number = 10, ExamComponent: number = 0) => {
        const res = await getExamList(pg, lim, ExamComponent);
        if(!res) return;
        const visibleExams = res.exams.filter((exam: IExam) => exam.Status !== 0);
        setExams(visibleExams);
        setTotal(res.total);
        setPageSize(res.pageSize);
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

function StudentExam(props: IStudentExamProps) {
    const navigate = useNavigate();
    const { exams, total, pageSize, loading, pageChangeCallback } = props;

    const viewExam = async (exam: IExam) => {
        const isSubmitted = await isExamSubmitted(exam.Id);

        if (isSubmitted) {
            navigate(`/student/exam/${exam.Id}/detail`);
        } else {
            navigate(`/student/exam/${exam.Id}`)
        }
    }


    const generateTableColumns = () => {
        const columns: TableColumnsType<IExam> = [
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