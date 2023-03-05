import { Button, Cascader, Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { setExamStatusApi } from '../../api/exam';
import { IPublishExamProps } from '../../interfaces/Exam';
import { Option } from '../../interfaces/Student';
import { getOptions } from '../../wrapper/Student';

export default function PublishExam(props: IPublishExamProps) {
    const { visible, cancel, exam, callback } = props;

    const [options, setOptions] = useState<Option[]>([])
    const getOpts = async()=>{
        const options = await getOptions();
        setOptions(options);
    }
    useEffect(() => {
        getOpts()
    }, [])

    // const onChange = (value: (string | number)[][]) => {
    //     console.log(value);
    // };

    const onFinish = async (values: any) => {
        console.log(`提交数据：${JSON.stringify(values)}`);
        const item = values.Class;
        console.log(`提交数据：grade：${item[0]} class: ${item[1]}`);
        const Grade = item[0]
        const [Major, Class] = item[1].split('-');
        const res = await setExamStatusApi(values.ExamId, 1, Grade, Major, Number.parseInt(Class));
        if(!res) return;
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
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="Class"
                        required={true}
                    >
                        <Cascader
                            style={{ width: '100%' }}
                            options={options}
                            // onChange={onChange}
                            // multiple
                            maxTagCount="responsive"
                            placeholder="请选择班级" />
                    </Form.Item>
                    <Form.Item
                        name="ExamId"
                        required={true}
                        initialValue={exam.Id}
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                    >
                        <Button type="primary" htmlType='submit'>确认发放</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
