import React, { useEffect, useState } from 'react'
import { IExam } from '../exam/ExamList';
import { useParams } from "react-router-dom";
import { Button, Card, Collapse, message, Space, Table, TableColumnsType, Tag } from 'antd';
import { getExamById, getExamCriteriaApi } from '../../api/exam';
import { getComponentById } from '../../api/comp';
import { getSizeCountByComponentId, getSizeList } from '../../api/size';
import { IComponent } from '../component/ComponentList';
import { generateSizeTableColumns, ISize } from '../size/SizeList';
import { REACT_APP_BASE_API } from '../../config/default';
import { generateCriteriaColumns, ICriteria } from '../exam/Criteria';

export default function Exam() {
  const [exam, setExam] = useState<IExam>();
  const [component, setComponent] = useState<IComponent>();
  const [sizes, setSizes] = useState<ISize[]>();
  const [criterias, setCriterias] = useState<ICriteria[]>();

  const params = useParams();
  const getExam = async (id: number) => {
    const res = await getExamById(id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
      message.error(`访问考核详情失败，系统错误：${msg}`);
      return
    }
    return data;
  }
  const getComponent = async (id: number) => {
    const res = await getComponentById(id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
      message.error(`访问零件详情失败，系统错误：${msg}`);
      return
    }
    return data
  }
  const getSizeCount = async (id: number) => {
    const res = await getSizeCountByComponentId(id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
      message.error(`访问零件尺寸数量失败，系统错误：${msg}`);
      return
    }
    return data.count;
  }
  const getSizes = async (id: number) => {
    const count = await getSizeCount(id);
    if (count) {
      const res = await getSizeList(1, count, id);
      const { code, msg, data } = res.data;
      if (code !== 0) {
        message.error(`访问零件尺寸列表失败，系统错误：${msg}`);
        return
      }
      return data;
    }
  }
  const getCriteria = async (id: number) => {
    const res = await getExamCriteriaApi(id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
      message.error(`访问考核标准失败，系统错误：${msg}`);
      return
    }
    return data;
  }


  const fetchExam = async (id: string | undefined) => {
    console.log(`id of page: ${id}`)
    if (!id || isNaN(Number.parseInt(id))) {
      message.error(`访问页面无效！`);
      return
    }
    const examId = Number.parseInt(id);
    const exam = await getExam(examId);
    if (exam) {
      setExam(exam);
      const criterias = await getCriteria(exam.CriteriaId);
      if (criterias) {
        setCriterias(criterias);
      }
      console.log(`criterias:${criterias}`)
      const component = await getComponent(exam.ExamComponent);
      if (component) {
        setComponent(component);

        const sizes = await getSizes(exam?.ExamComponent);
        if (sizes) {
          setSizes(sizes);
        }
      }
    }
  }

  useEffect(() => {
    fetchExam(params.id);
  }, [])
  return (
    <div>
      {exam && component && sizes && criterias && <ExamCard exam={exam} component={component} sizes={sizes} criterias={criterias} />}
    </div>
  )
}

interface IProps {
  exam: IExam
  component: IComponent,
  sizes: ISize[],
  criterias: ICriteria[]
}
function ExamCard(props: IProps) {
  const { exam, component, sizes, criterias } = props;
  return (
    <Collapse accordion>
      <Collapse.Panel header="考核详情" key="1">
        <Card title='基本信息'
        >
          <Space direction="vertical">
            {`考核日期：${exam.ExamDate}`}
            {`考核时间：${exam.StartTime}`}
            {`交件时间: ${exam.FinishTime}`}
            {`考核项目: ${exam.ExamTarget}`}
            {`考核教师: ${exam.ExamTeacher}`}
            {`考核零件: ${exam.ExamComponent}`}
            {`考核状态: ${exam.Status}`}
          </Space>
          {/* 考核基本信息 */}
        </Card>
        <Card title='考核图样'
          cover={<img alt="考核图样" src={`${REACT_APP_BASE_API}${component.ClipPath}`} />}
        >
          {/* 考核图样 */}
        </Card>
        <Card title='评测说明'
        >
          {generateCriteriaTable(criterias)}
          {/* 考核标准 */}
        </Card>
        <Card title='考核项目配分'
        >
          {generateSizeTable(sizes, exam)}
          {/* 考核尺寸配分及填写测量尺寸 */}
        </Card>
      </Collapse.Panel>
      <Collapse.Panel header="自测数据" key="2">

      </Collapse.Panel>
    </Collapse>
  )
}

function generateCriteriaTable(criterias: any) {
  const columns: TableColumnsType<any> = [...generateCriteriaColumns()]
  return <Table dataSource={criterias} columns={columns} pagination={false}></Table>
}

const generateSizeTable = (sizes: any, exam:IExam) => {
  const columns = generateSizeTableColumns();
  const filterdColumns = columns.filter(column=>column.key !== 'ComponentId' && column.key !=='SizeId')
  const c: TableColumnsType<any> = [
      ...filterdColumns,
      {
        title: '配分',
        key: 'score',
        render: (_: any, size: ISize)=>{
          const sizeId = size.Id;
          const scoreItem = exam.Data?.scores.filter(item=>item.SizeId === sizeId);
          if (scoreItem && scoreItem.length >0){
            return scoreItem[0].Score;
          }
          return 0
        }
      }
  ];
  sizes.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType })
  return <Table
      dataSource={sizes}
      columns={columns}
      pagination={false}
      scroll={{ y: 400 }}
   />

}