import { Form, Button, Tag, Input, Space, Select, message, TimePicker, DatePicker, Steps, } from 'antd';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { saveExam } from '../../api/exam';
import CriteriaV2 from './CriteriaV2';
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


const format = "HH:mm";
export const SizePrecisionLevel = ['精密f', '中等m', '粗糙c', '最粗v']


export default function AddExamFC() {

    const navigate = useNavigate();
    const location = useLocation();

    const [current, setCurrent] = useState(0);
    const [examId, setExamId] = useState(0);
    const steps = [
        {
            title: '考核信息',
            component: <ExamBasicInfo
                componentId={location.state.id}
                callback={(id: number) => { setExamId(id); setCurrent(current + 1) }} />

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
                callback={()=>navigate('/exam')}
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
interface IProps {
    componentId: number,
    callback: (id: number) => void
}
function ExamBasicInfo(props: IProps) {
    const { componentId, callback } = props;
    const addExam = async (values: any) => {
        console.log(`提交数据： ${JSON.stringify(values)}`);
        const res = await saveExam(values);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`新建考核失败，系统错误：${msg}`);
            return
        }
        message.success(`新建考核成功`);
        callback(data.Id)
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
                >
                    <Tag>钳工</Tag>
                </Form.Item>
                <Form.Item
                    label="考核零件"
                    required={true}
                    name="ExamComponent"
                    initialValue={componentId}
                >
                    <Tag>{componentId}</Tag>
                </Form.Item>
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
                    label="考核教师"
                    name="ExamTeacher"
                    required={true}
                    rules={[{
                        required: true,
                        message: '请输入考核教师'
                    }]}
                >
                    <Input />
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