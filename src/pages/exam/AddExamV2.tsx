import { Form, Button, Tag, Input, Space, Select, message, TimePicker, DatePicker, Steps, } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getExamTarget, saveExam } from '../../api/exam';
import { format, IExamBasicInfoProps, SizePrecisionLevel } from '../../interfaces/Exam';
import { get } from '../../utils/storage';
import CriteriaV2 from './CriteriaV2';
import EditPrecision from './EditPrecision';
import StandardV2 from './StandardV2';


/**
 * 添加考试
 * 基本信息管理
 * 考核日期：时间组件
 * 考核时间：几点几分
 * 交件时间  几点几分
 * 班级：自填
 * 姓名：自填
 * 考号：自填
 * 考核项目：选择框
 * 考评教师1：？选择框？
 * 考评教师2：非必填
 * 
 * 评测标准
 * 长度
 * 角度
 * 直径
 * 公差度
 * 粗糙度
 * 棱边倒角
 * 螺母规格
 * 
 * 考核零件：选择框
 */


// const format = "HH:mm";
// export const SizePrecisionLevel = ['精密f', '中等m', '粗糙c', '最粗v', '自定义']


export default function AddExamFC() {

    const navigate = useNavigate();
    const location = useLocation();

    const [current, setCurrent] = useState(0);
    const [examId, setExamId] = useState(0);
    const [level, setLevel] = useState(-1);
    const [examTargets, setExamTargets] = useState<string[]>([]);

    const fetchTarget = async () => {
        const res = await getExamTarget();
        const targetList = res.map(target=>target.Name)
        setExamTargets(targetList);
    }

    useEffect(() => {
        fetchTarget();
    }, [])
    const steps = [
        {
            title: '考核信息',
            component: <ExamBasicInfo
                componentId={location.state.id}
                examTargets={examTargets}
                callback={(examId: number, level: number) => { 
                    setExamId(examId); 
                    setLevel(level);
                    setCurrent(current + 1) }} />
        },
        {
            title: '线性尺寸公差编辑',
            component: <EditPrecision
                examId={examId}
                level={level}
                callback={() => setCurrent(current + 1)} />
        },
        {
            title: '评测说明',
            component: <CriteriaV2
                ExamId={examId}
                ExamComponent={location.state.id}
                callback={() => setCurrent(current + 1)} />
        },
        {
            title: '项目配分',
            component: <StandardV2
                ExamId={examId}
                callback={() => navigate('/teacher/exam/list')}
            />
        }
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    return (
        <div>
            < Steps current={current} items={items} />
            <div className="steps-content">{steps[current].component}</div>
        </div>
    )
}

function ExamBasicInfo(props: IExamBasicInfoProps) {
    const { componentId, examTargets, callback } = props;
    const navigate = useNavigate();
    const assiger = get('Name');
    const teacherId = get(`Id`);
    const addExam = async (values: any) => {

        const res = await saveExam(values);
        if(!res) return;
        callback(res.Id, values.SizePrecisionLevel)
    }
    return (
        <div>
            <Form
                onFinish={addExam}
            >
                <Form.Item
                    label="考核日期"
                    name="ExamDate"
                    rules={[{
                        required: true,
                        message: '请选择考核日期'
                    }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="考核时间"
                    name="StartTime"
                    required={true}
                    rules={[{
                        required: true,
                        message: '请设置考核时间'
                    }]}
                >
                    <TimePicker
                        minuteStep={10}
                        format={format}
                    />
                </Form.Item>
                <Form.Item
                    label="交件时间"
                    name="FinishTime"
                    required={true}
                    rules={[{
                        required: true,
                        message: '请设置交件时间'
                    }]}
                >
                    <TimePicker
                        minuteStep={10}
                        format={format}
                    />
                </Form.Item>
                <Form.Item
                    label="考核项目"
                    name="ExamTarget"
                    initialValue={"钳工"}
                    rules={[{
                        required: true,
                        message: '请选择'
                    }]}
                >
                    <Space>
                        <Select style={{ width: 240 }}
                        >
                            {
                                examTargets.map((Name: string, index: number) =>
                                    <Select.Option key={index} value={Name}>{Name}</Select.Option>
                                )
                            }
                        </Select>
                        <Button type='primary' onClick={() => navigate('/teacher/exam/target/create')} >新建</Button>
                    </Space>
                </Form.Item>
                <Form.Item
                    label="考核零件"
                    required={true}
                    name="ExamComponent"
                    initialValue={componentId}
                >
                    <Tag>{componentId}</Tag>
                </Form.Item>
                注：线性尺寸公差数据支持手动输入，若要手动输入，请选择下拉框中的【自定义】。
                <Form.Item
                    label="线性尺寸公差等级"
                    required={true}
                    name="SizePrecisionLevel"
                    rules={[{
                        required: true,
                        message: '请选择公差等级'
                    }]}
                >
                    <Select style={{ width: 240 }}
                    >
                        {
                            SizePrecisionLevel.map((level: string, index: number) =>
                                <Select.Option key={index} value={index}>{level}</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="发布教师"
                    name="ExamTeacher"
                    initialValue={teacherId}
                >
                    <Tag>{assiger}</Tag>
                </Form.Item>

                <Space size={'large'}>
                    <Button
                        type='primary'
                        htmlType='reset'

                    >重置</Button>
                    <Button
                        type='primary'
                        htmlType='submit'

                    >保存</Button>
                </Space>
            </Form>

        </div>
    )
}