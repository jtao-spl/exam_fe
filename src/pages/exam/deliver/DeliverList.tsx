import { Button, message, Popconfirm, Space, Switch, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getGrades } from '../../../api/admin';
import { getExamDeliverList, getExamsByIds, getProgessByDeliverIds, updateDeliverStatus } from '../../../api/exam';
import { batchGetStudentGradeInfo, downloadScoreTable } from '../../../api/student';
import { IDeleverTableProps, IDeliverProgress, IExam, IExamDeliver, IExamDeliverEntity } from '../../../interfaces/Exam'
import { IGrade } from '../../../interfaces/Student';
import { generateStudentDeliverTableColumns, generateTeacherDeliverTableColumns } from '../../../wrapper/Exam';

//考试详情
export default function DeliverList() {
  const [delivers, setDelivers] = useState<IExamDeliverEntity[]>([]);
  const [pageSize, setPageSize] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const init = async (pg: number = 1, lmt: number = 10) => {
    setLoading(true);
    const res = await getExamDeliverList(pg, lmt, false);
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
          isArchived={false}
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


export function DeliverTable(props: IDeleverTableProps) {
  const navigate = useNavigate();
  const { isTeacher, isArchived, delivers, loading, callback, pageSize, total, pageChangeCallback } = props;

  const getTeacherColums = () => {
    const notArchivedOpColumn = {
      title: `操作`, key: 'op', render: (_: any, record: IExamDeliverEntity) => {
        return (<Space direction='vertical'>
          <Button type='primary'
            onClick={() => setDeliverStatus(record.Id, 1)}
            disabled={record.Status !== 0}
          >下发</Button>
          <Popconfirm
            title={"收卷后学生不可再提交，确认收卷？"}
            disabled={record.Status !== 1}
            onConfirm={() => setDeliverStatus(record.Id, 2)}
            onCancel={() => message.info(`取消收卷`)}
          >
            <Button type='primary'
              disabled={record.Status !== 1}
            >收卷</Button>
          </Popconfirm>
          <Button
            type="primary"
            disabled={record.Status !== 2}
            onClick={() => navigate(`/teacher/exam/final/${record.Id}`)}>去复测</Button>
        </Space>)
      }
    };
    const archivedOpColumn = {
      title: `操作`, key: 'op', render: (_: any, record: IExamDeliverEntity) => {
        return (
          <Button type='primary'
            onClick={() => navigate(`/teacher/exam/stats`, { state: record.Id })}>查看成绩分析</Button>
        )
      }
    }
    const columns: TableColumnsType<IExamDeliverEntity> = [
      ...generateTeacherDeliverTableColumns(),
      isArchived ? archivedOpColumn : notArchivedOpColumn
    ]
    return columns;
  }

  const getStudentColumns = () => {
    const columns: TableColumnsType<IExamDeliverEntity> = [
      ...generateStudentDeliverTableColumns(),
      {
        title: `操作`, key: 'op', render: (_: any, record: IExamDeliverEntity) => {
          return (<Space>
            <Button type='primary'
              onClick={() => navigate(`/student/exam/${record.Id}/${record.DeliverDetailId}`)}
              disabled={record.Status !== 1}
            >去考试</Button>
            <Button type='primary'
              disabled={record.Status !== 3}
              onClick={async () => await downloadScoreTable(record.Id)}>
              下载报告单
            </Button>
          </Space>)
        }
      }
    ]
    return columns;
  }

  /**
   * 
   * @param id 考核id
   * @param status 考核状态，0：待发放， 1 已发放 2 已收卷
   * @returns 
   */
  const setDeliverStatus = async (id: number, status: number) => {
    const res = await updateDeliverStatus(id, status);
    if (!res) return;
    message.info(`操作成功`);
    callback();
  }
  return <Table
    rowKey={record => record.Id}
    columns={isTeacher ? getTeacherColums() : getStudentColumns()}
    dataSource={delivers}
    loading={loading}
    pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
    onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
  />
}