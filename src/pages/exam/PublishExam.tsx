import { Button, Cascader, DatePicker, Form, Input, message, Modal, Radio, Space, Tag, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createNewExamDeliver } from '../../api/exam';
import { format, IPublishExamProps } from '../../interfaces/Exam';
import { Option } from '../../interfaces/Student';
import { getOptionsV2 } from '../../wrapper/Student';

export default function PublishExam(props: IPublishExamProps) {
    const { visible, cancel, exam, callback } = props;
    const navigate = useNavigate()
    const [options, setOptions] = useState<Option[]>([])
    const getOpts = async () => {
        const options = await getOptionsV2(true);
        setOptions(options);
    }
    useEffect(() => {
        getOpts()
    }, [])

    // const onChange = (value: (string | number)[][]) => {
    //     console.log(value);
    // };
    const examTypeOptions = [
        { label: '日常训练', value: 0 },
        { label: "期末考核", value: 1 }
    ]

    const onFinish = async (values: any) => {
        console.log(`提交数据：${JSON.stringify(values)}`);
        const { ExamName, ExamType, ExamDate, StartTime } = values;
        const [Grade, Major, Class, Group] = values.Class;
        if(Major === undefined) {
            message.error(`校验失败：专业为必选项`);
            return;
        }
        const res = await createNewExamDeliver(exam.Id, ExamName, ExamType, ExamDate, StartTime, Grade, Major, Number.parseInt(Class), Group);
        if (!res) return;
        callback();
    }
    return (
        <div>
            <Modal
                title="下发考核"
                open={visible}
                footer={null}
                onCancel={() => cancel()}
            >
                <Space direction='vertical'>

                    <Form
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="考核名称"
                            name="ExamName"
                            rules={[{
                                required: true,
                                message: '请输入'
                            }]}
                        >
                            <Input maxLength={100} />
                        </Form.Item>
                        <Form.Item
                            label="考核类型"
                            name="ExamType"
                            rules={[{
                                required: true,
                                message: '请选择考核类型'
                            }]}
                        >
                            <Radio.Group
                                options={examTypeOptions}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Form.Item>
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
                        {/* <Form.Item
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
                        </Form.Item> */}
                        <Form.Item
                            name="Class"
                            label="发放班级"
                            rules={[{
                                required: true,
                                message: '请选择'
                            }]}
                        >   
                            {/* //TODO: 要支持更粗粒度的班级*/}
                            <Cascader
                                style={{ width: '100%' }}
                                options={options}
                                // onChange={onChange}
                                //multiple   //是否支持多选。打开以后Class是嵌套list 如 [[2022,"冼工"],[2022,"钳工",1]]
                                maxTagCount="responsive"
                                placeholder="请选择班级" />
                        </Form.Item>
                        <Form.Item
                        >
                            <Button type="primary" htmlType='submit'>确认发放</Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <Tag>
                            注：未设置分组的班级仅支持下发给班级的全部同学。
                        </Tag>
                        <Button type='primary' onClick={() => navigate(`/teacher/student/list`)}>去分组</Button>
                    </div>
                </Space>
            </Modal>
        </div>
    )
}
