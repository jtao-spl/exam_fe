import { Button, message, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../../../api/exam';
import { getExamScoreList } from '../../../api/score';
import { batchGetStudentInfo } from '../../../api/student';
import { ExamStatus2Desc, IExam, IScore, IScoreTableProps } from '../../../interfaces/Exam';
import { IStudentInfo } from '../../../interfaces/Student';


export default function ScoreList() {
    const params = useParams();
    const [scoreList, setScoreList] = useState<IScore[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState<IStudentInfo[]>([]);
    const [exam, setExam] = useState<IExam>();

    const getExamDataScoreList = async (id: string | undefined, page: number = 1, limit: number = 50) => {
        if (!id || isNaN(Number.parseInt(id))) {
            message.error(`访问页面无效！`);
            return
        }
        const ExamId = Number.parseInt(id);
        const exam = await getExamById(ExamId);
        if (!exam) return;
        setExam(exam);
        const res = await getExamScoreList(ExamId, page, limit);
        if (!res) return;

        if (res.items.length === 0) {
            message.warn(`当前暂无考核记录`);
            return
        }
        const ids = res.items.map((item: IScore) => item.StudentId)
        const resp = await batchGetStudentInfo({ StudentIds: ids });
        setStudentInfo(resp);

        setScoreList(res.items);
        setLoading(false);
        setPageSize(limit);
        setTotal(total);
    }

    useEffect(() => {
        getExamDataScoreList(params.id);
    }, [])


    return (
        <div>
            <ExamBasicInfo exam={exam} />
            {scoreList &&
                <ScoreTable
                    scoreList={scoreList}
                    total={total}
                    exam={exam}
                    pageSize={pageSize}
                    loading={loading}
                    students={studentInfo}
                    callback={() => getExamDataScoreList(params.id)}
                    pageChangeCallback={(page: number) => getExamDataScoreList(params.id, page)}
                />
            }

        </div>
    )
}

interface IProps2 {
    exam?: IExam
}
function ExamBasicInfo(props: IProps2) {
    const { exam } = props;
    return (<div>
        {exam &&
            <Space direction="vertical">
                {/* {`考核日期：${exam.ExamDate}`}
                {`考核时间：${exam.StartTime}`}
                {`交件时间: ${exam.FinishTime}`} */}
                {`考核项目: ${exam.ExamTarget}`}
                {/* {`考核教师: ${exam.ExamTeacher}`} */}
                {`考核零件: ${exam.ExamComponent}`}
                {`考核状态: ${ExamStatus2Desc.get(exam.Status)}`}
            </Space>
        }
    </div>)
}

interface DataType extends IScore {
    key: React.Key,
    Name?: string
}

function ScoreTable(props: IScoreTableProps) {
    const { scoreList, total, pageSize, loading, exam, callback, students, pageChangeCallback } = props;

    const navigate = useNavigate();
    const generateScoreInfoTableColumns = () => {
        const columns: TableColumnsType<any> = [
            { title: '考核ID', key: 'ExamId', dataIndex: 'ExamId' },
            { title: '学号', key: 'stuId', dataIndex: 'StudentId' },
            { title: '姓名', key: 'stuName', dataIndex: 'Name' },
            { title: '自测成绩', key: 'SelfScore', dataIndex: 'SelfScore' },
            {
                title: '小组成绩', key: 'GroupScore', render: (_: any, record: IScore) => {
                    if (record.GroupData === null && record.GroupScore === 0) {
                        return (<div>-</div>)
                    }
                    return record.GroupScore
                }
            },
            {
                title: '复测成绩', key: 'FinalScore', render: (_: any, record: IScore) => {
                    if (record.FinalData === null && record.FinalScore === 0) {
                        return <div>-</div>
                    }
                    return record.FinalScore
                }
            },
            {
                title: '操作', key: 'operation', render: (_: any, record: DataType) => {
                    return (<Space>
                        <Button type="primary" onClick={() => navigate(`/teacher/exam/${exam?.Id}/scores/${record.StudentId}/edit`)}>填写复测数据</Button>
                    </Space>)
                }
            }
        ]
        return columns;
    }


    if (students) {
        const newScoreList = scoreList.map((score: IScore) => {
            const cur = students.filter((student: IStudentInfo) => student.StudentId === score.StudentId)
            if (cur.length > 0) {
                return { ...score, Name: cur[0].Name }
            }
            return score
        })
        return (<div>
            <Table
                rowKey={record => record.Id}
                dataSource={newScoreList}
                columns={generateScoreInfoTableColumns()}
                pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
                scroll={{ y: 400 }}
                onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
                loading={loading} />
        </div>)
    }
    return (<div>
        <Table
            rowKey={record => record.Id}
            dataSource={scoreList}
            columns={generateScoreInfoTableColumns()}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }}
            onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
            loading={loading} />
    </div>)

}
