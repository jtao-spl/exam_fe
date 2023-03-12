import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Collapse, Form, InputNumber, message, Space, Table, TableColumnsType, Tag } from 'antd';
import { getExamById, getExamCriteriaApi } from '../../api/exam';
import { getComponentById } from '../../api/comp';
import { REACT_APP_BASE_API } from '../../config/default';
import { getExamScore, isExamSubmitted, saveExamScore } from '../../api/score';
import { IComponent } from '../../interfaces/Component';
import { ISize, ISizeWithScore, ISizeWithScoreAll } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { ExamScoreData, ExamStatus2Desc, IExam, IExamCardProps, IExamProps, sizeScopeToDelta } from '../../interfaces/Exam';
import { ICriteria } from '../../interfaces/ExamCriteria';
import { calcuateScore, getCalculatedSizeForExam } from '../../wrapper/Exam';
import { generateSizeTableColumns } from '../../wrapper/Size';
import { generateCriteriaColumns } from '../../wrapper/Criteria';

export default function Exam(props: IExamProps) {
  const { role } = props;

  const [exam, setExam] = useState<IExam>();
  const [component, setComponent] = useState<IComponent>();
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [criterias, setCriterias] = useState<ICriteria[]>([]);
  const [isSub, setIsSub] = useState(false);

  const params = useParams();

  const fetchExam = async (id: string | undefined) => {
    if (!id || isNaN(Number.parseInt(id))) {
      message.error(`访问页面无效！`);
      return
    }
    const examId = Number.parseInt(id);
    const exam = await getExamById(examId);
    if (role === 'student') {
      const res = await isExamSubmitted(examId);
      setIsSub(res);
    }
    if (exam) {
      setExam(exam);
      const criterias = await getExamCriteriaApi(exam.CriteriaId);
      setCriterias(criterias);
      const component = await getComponentById(exam.ExamComponent);
      setComponent(component);
      if (component) {
        const sizes = await getSizesByComponentId(exam?.ExamComponent);
        if (sizes.length === 0) return;
        const newSizes = getCalculatedSizeForExam(exam, sizes);
        setSizes(newSizes);
      }
    }
  }

  useEffect(() => {
    fetchExam(params.id);
  }, [])
  if (role === 'student') {
    return (
      <div>
        {!isSub && exam && component && sizes.length > 0 && criterias.length > 0 && <ExamCard exam={exam} component={component} sizes={sizes} criterias={criterias} role={role} />}
        {isSub && exam && component && sizes.length > 0 && criterias.length > 0 && <ExamDetail exam={exam} component={component} sizes={sizes} criterias={criterias} role={role} />}
      </div>
    )
  } else if (role === 'teacher') {
    return (<div>
      {exam && component && sizes && criterias && <ExamCard exam={exam} component={component} sizes={sizes} criterias={criterias} role={role} studentId={params.studentId} />}
    </div>)
  } else {
    //role ==='group'
    return <div></div>
  }
}


function ExamCard(props: IExamCardProps) {
  const { exam, component, sizes, criterias, role, studentId } = props;
  const [form] = Form.useForm();
  const navigate = useNavigate()
  form.resetFields(["table"]);
  form.setFieldsValue({
    table: sizes
  });

  let stuId: number = 0;
  if (role === 'teacher') {
    if (!studentId) {
      message.error(`系统异常，评分详情页链接中学生id缺失`);
      return <div></div>
    } else {
      stuId = Number.parseInt(studentId);
    }
  }



  const resetTableContent = (value: number | null, size: ISizeWithScore) => {
    if (!value) return;

    const other = sizes.filter((s: ISizeWithScore) => s.Id !== size.Id); //非改动的数据
    const score = calcuateScore(value, size, criterias, exam);
    if (score === undefined) {
      return;
    }

    const newSize: ISizeWithScore = { ...size, score: score };

    const newSizes = [...other, newSize];
    newSizes.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType })
    form.setFieldsValue({ table: newSizes });
  }

  const generateInputColumns = () => {
    const fullColumns = generateSizeTableColumns();
    const columns: TableColumnsType<ISize> = [
      ...fullColumns,
      {
        title: '测量值/数量',
        key: 'size',
        render: (_: any, size: ISizeWithScore, index) => {
          if (size.FirstType === 2) {
            return (
              <Form.Item name={['Sizes', index, 'size']}
                required={true}
                rules={[{
                  required: true,
                  message: '请输入数量'
                }]}>
                <InputNumber min={0} step={1} max={size.SurfaceRoughnessCount} onChange={(value: any) => resetTableContent(value, size)} />
              </Form.Item>
            )
          } else if (size.FirstType === 3) {
            return (<Form.Item name={['Sizes', index, 'size']}
              required={true}
              rules={[{
                required: true,
                message: '请输入数量'
              }]}>
              <InputNumber min={0} step={1} max={size.UnDeclaredChamferCount} onChange={(value: any) => resetTableContent(value, size)} />
            </Form.Item>)
          } else {
            return (
              <Form.Item name={['Sizes', index, 'size']}
                required={true}
                rules={[{
                  required: true,
                  message: '请输入测量尺寸'
                }]}>
                <InputNumber min={0} onChange={(value: any) => resetTableContent(value, size)} />
              </Form.Item>
            )
          }
        },
      },
      {
        title: '得分',
        key: 'score',
        dataIndex: 'score'
      }
    ]
    return columns;
  }
  const onFinish = async (values: any) => {
    console.log(`submit values: ${JSON.stringify(values)}`)
    const sizeList: ISizeWithScore[] = values.table;
    const Sizes: { size: number }[] = values.Sizes;
    const scoreData = sizeList.map((size: ISizeWithScore, index: number) => {
      const score = calcuateScore(Sizes[index]['size'], size, criterias, exam);
      if (score === undefined) {
        return null;
      }
      return { SizeId: size.Id, SizeValue: Sizes[index]['size'], SizeScore: score }
    })
    if (scoreData.some((item) => item === null)) {
      message.error(`计算成绩失败，请重试`);
      return
    }
    const nonEmptyScores = scoreData.filter((item) => item !== null)
    const totalScore = (nonEmptyScores as ExamScoreData[]).map((item) => item.SizeScore).reduce((a, b) => a + b);
    let saveKey: string;
    if (role === 'student') {
      saveKey = 'self'
    } else if (role === 'teacher') {
      saveKey = 'final'
    } else {
      saveKey = 'group'
    }
    const res = await saveExamScore(exam.Id, (nonEmptyScores as ExamScoreData[]), totalScore, saveKey, stuId);
    if (res) {
      setTimeout(() => {
        navigate(-1)
      }, 500);
    }
  }
  return (
    <Collapse>
      <Collapse.Panel header="考核详情" key="1">
        <Card title='基本信息'
        >
          <Space direction="vertical">
            {/* {`考核日期：${exam.ExamDate}`}
            {`考核时间：${exam.StartTime}`}
            {`交件时间: ${exam.FinishTime}`} */}
            {`考核项目: ${exam.ExamTarget}`}
            {/* {`考核教师: ${exam.Creator}`} */}
            {`考核零件: ${exam.ExamComponent}`}
            {`考核状态: ${ExamStatus2Desc.get(exam.Status)}`}
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
      <Collapse.Panel header="测量数据" key="2">
        <div>
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="table"
              valuePropName='dataSource'
            >
              <Table rowKey={record => record.Id} bordered columns={generateInputColumns()} pagination={false} scroll={{ x: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Collapse.Panel>
    </Collapse>
  )
}

/**
 * 评测说明表格
 * @param criterias  评测标准 
 * @returns 
 */
function generateCriteriaTable(criterias: ICriteria[]) {
  const columns: TableColumnsType<ICriteria> = [...generateCriteriaColumns()]
  return <Table rowKey={record => record.Id} dataSource={criterias} columns={columns} pagination={false}></Table>
}

/**
 * 项目配分表格
 * @param sizes 尺寸列表
 * @param exam 考核实例
 * @returns 
 */
const generateSizeTable = (sizes: any, exam: IExam) => {
  const columns = generateSizeTableColumns();
  const filterdColumns = columns.filter(column => column.key !== 'ComponentId' && column.key !== 'SizeId')
  const c: TableColumnsType<ISize> = [
    ...filterdColumns,
    {
      title: '配分',
      key: 'score',
      render: (_: any, size: ISize) => {
        const sizeId = size.Id;
        const scoreItem = exam.Data?.scores?.filter(item => item.SizeId === sizeId);
        if (scoreItem && scoreItem.length > 0) {
          return scoreItem[0].Score;
        }
        return 0
      }
    }
  ];
  return <Table
    rowKey={record => record.Id}
    dataSource={sizes}
    columns={c}
    pagination={false}
    scroll={{ y: 400 }}
  />

}

/**
 * 考核成绩详情展示
 * @param props 
 * @returns 
 */
function ExamDetail(props: IExamCardProps) {
  const { exam, component, sizes, criterias } = props;
  const [selfScore, setSelfScore] = useState(0);
  const [groupScore, setGroupScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [sizeExt, setSizeExt] = useState<ISizeWithScoreAll[]>([]);

  const getDataAndScore = async () => {
    const res = await getExamScore(exam.Id);
    if(!res) return;
    const { SelfData, SelfScore, GroupData, GroupScore, FinalData, FinalScore } = res;
    setSelfScore(SelfScore);
    setGroupScore(GroupScore);
    setFinalScore(FinalScore);
    const newSizes = sizes.map((size: ISize) => {
      let tmp: ISizeWithScoreAll = size;
      if (SelfData) {
        const cur = SelfData.filter((data: ExamScoreData) => data.SizeId === size.Id);
        if (cur.length !== 0) {
          tmp = { ...tmp, SelfSize: cur[0].SizeValue, SelfScore: cur[0].SizeScore }
        }
      }
      if (GroupData) {
        const cur = GroupData.filter((data: ExamScoreData) => data.SizeId === size.Id);
        if (cur.length !== 0) {
          tmp = { ...tmp, GroupSize: cur[0].SizeValue, GroupScore: cur[0].SizeScore }
        }
      }
      if (FinalData) {
        const cur = FinalData.filter((data: ExamScoreData) => data.SizeId === size.Id);
        if (cur.length !== 0) {
          tmp = { ...tmp, FinalSize: cur[0].SizeValue, FinalScore: cur[0].SizeScore }
        }
      }
      return tmp;
    })
    setSizeExt(newSizes);
  }
  useEffect(() => {
    getDataAndScore()
  }, [])
  const generateExamTableColomns = () => {
    const fullColumns = generateSizeTableColumns();
    const columns: TableColumnsType<any> = [
      ...fullColumns,
      {
        title: '自测值/数量',
        key: 'SelfSize',
        dataIndex: 'SelfSize'
      },
      {
        title: '自测得分',
        key: 'SelfScore',
        dataIndex: 'SelfScore'
      },
      {
        title: '小组评测/数量',
        key: 'GroupSize',
        dataIndex: 'GroupSize'
      },
      {
        title: '小组得分',
        key: 'GroupScore',
        dataIndex: 'GroupScore'
      },
      {
        title: '教师复测值/数量',
        key: 'FinalSize',
        dataIndex: 'FinalSize'
      },
      {
        title: '复核得分',
        key: 'FinalScore',
        dataIndex: 'FinalScore'
      },
    ]
    return columns;
  }
  return (
    <Collapse>
      <Collapse.Panel header="考核详情" key="1">
        <Card title='基本信息'
        >
          <Space direction="vertical">
            {/* {`考核日期：${exam.ExamDate}`}
            {`考核时间：${exam.StartTime}`}
            {`交件时间: ${exam.FinishTime}`} */}
            {`考核项目: ${exam.ExamTarget}`}
            {/* {`考核教师: ${exam.ExamTeacher}`} */}
            {`考核零件: ${exam.ExamComponent}`}
            {`考核状态: ${ExamStatus2Desc.get(exam.Status)}`}
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
      <Collapse.Panel header="考核结果" key="2">
        <div>
          <Table rowKey={record => record.Id} bordered dataSource={sizeExt} columns={generateExamTableColomns()} pagination={false} scroll={{ x: "100%" }} />
          <Space direction='vertical'>
            <Space>
              <Tag>自测得分</Tag>
              <Tag>{selfScore}</Tag>
            </Space>
            <Space>
              <Tag>小组得分</Tag>
              <Tag>{groupScore === 0 ? '-' : groupScore}</Tag>
            </Space>
            <Space>
              <Tag>复核得分</Tag>
              <Tag>{finalScore}</Tag>
            </Space>
          </Space>

        </div>
      </Collapse.Panel>
    </Collapse>
  )
}