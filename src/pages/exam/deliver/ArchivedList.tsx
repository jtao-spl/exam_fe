import { Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { getExamDeliverList, getExamsByIds, getProgessByDeliverIds } from '../../../api/exam';
import { batchGetStudentGradeInfo } from '../../../api/student';
import { IExamDeliverEntity, IExamDeliver, IExam, IDeliverProgress } from '../../../interfaces/Exam';
import { IGrade } from '../../../interfaces/Student';
import { DeliverTable } from './DeliverList';

export default function ArchivedList() {
    const [delivers, setDelivers] = useState<IExamDeliverEntity[]>([]);
    const [pageSize, setPageSize] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const init = async (pg: number = 1, lmt: number = 10) => {
        setLoading(true);
        const res = await getExamDeliverList(pg, lmt, true);
        if (!res) {
            setLoading(false);
            setDelivers([]);
            return
        }
        const DeliverIds = res.items.map((item: IExamDeliver) => item.Id);
        const ExamIds = res.items.map((deliver: IExamDeliver) => deliver.ExamId);
        const GradeIds = res.items.map((deliver: IExamDeliver) => deliver.GradeId);
        const uniqExamIds = Array.from(new Set(ExamIds));
        const uniqGradeIds = Array.from(new Set(GradeIds));
        if (uniqExamIds.length === 0) {
            setLoading(false);
            return
        }
        const exams = await getExamsByIds(uniqExamIds);
        const grades = await batchGetStudentGradeInfo(uniqGradeIds);
        const submitProgress = await getProgessByDeliverIds(DeliverIds);
        const items: IExamDeliverEntity[] = res.items.map((item: IExamDeliver) => ({
            ...item,
            Exam: exams.find((exam: IExam) => exam.Id === item.ExamId),
            Grade: grades.find((grade: IGrade) => grade.Id === item.GradeId),
            Progress: submitProgress.find((prog: IDeliverProgress) => prog.id === item.Id)
        }))
        setDelivers(items);
        setPageSize(res.pageSize);
        setTotal(res.total);
        setLoading(false);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <Space direction='vertical'>
                <DeliverTable
                    isTeacher={true}
                    isArchived={true}
                    delivers={delivers}
                    callback={init}
                    pageSize={pageSize}
                    total={total}
                    loading={loading}
                    pageChangeCallback={(page: number) => init(page)}
                />
            </Space>
        </div>
    )
}
