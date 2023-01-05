import { Button, message, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getExamList } from '../../api/exam';
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
        console.log(`get  exams: ${JSON.stringify(data)}`);
        const visibleExams = data.filter((exam:IExam)=>exam.Status !== 0);
        setExams(visibleExams);
        setTotal(total);
        setPageSize(limit);
        setLoading(false);

    }

    useEffect(()=>{
        getList(0, 10)
    },[])
    return (
        <div>
            <StudentExam exams={exams} total={total} pageSize={pageSize} loading={loading} />
        </div>
    )
}

interface IProps{
    exams: IExam[],
    total: number,
    pageSize: number,
    loading: boolean
}
interface DataType extends IExam{
    key: React.Key
}

function StudentExam(props:IProps){
    const navigate = useNavigate();
    const {exams, total, pageSize, loading}= props;
    const generateTableColumns = (exams:any)=>{
        const columns: TableColumnsType<DataType> = [
            ...generateExamTableColomns(),
            {
                title: "操作", key: "operation", render: (_: any, exam: IExam) => {
                    return (<Space direction='vertical'>

                        <Button type='primary' key={"viewSize"}
                            onClick={() => navigate(`/stu/exam/${exam.Id}`)}
                        >查看详情</Button>

                    </Space>)
                }
            }
        ]
        return <Table
            rowKey={record=>record.Id}
            dataSource={exams}
            columns={columns}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }} 
            loading={loading} /> 
    }
    return (<div>
        {generateTableColumns(exams)}
    </div>)
}