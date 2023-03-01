import { Button, Cascader, Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { setExamStatusApi } from '../../api/exam';
import { getAllGradeClass } from '../../api/student';
import { IExam } from './ExamList';
interface IProps {
    visible: boolean,
    cancel: () => void,
    exam: IExam
    callback: () => void
}

interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}

export default function PublishExam(props: IProps) {
    const { visible, cancel, exam, callback } = props;

    const [options, setOptions] = useState<Option[]>()

    const getOptions = async () => {
        const res = await getAllGradeClass();
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`查询年级&班级信息失败，系统错误：${msg}`);
            return [];
        }
        // data: :[{"Grade":2022,"Class":[1,2]},{"Grade":2021,"Class":[2,3]}]
        const options: Option[] = data.map((input: { Grade: number, Class: number[] }) => ({
            label: `${input.Grade}级`,
            value: input.Grade,
            children: input.Class.map((cls: number) => ({
                value: cls,
                label: `${cls}班`
            }))
        }))
        setOptions(options);
        return options;
    }
    useEffect(() => {
        getOptions()
    }, [])

    // const onChange = (value: (string | number)[][]) => {
    //     console.log(value);
    // };

    const onFinish = async (values: any) => {
        console.log(`提交数据：${JSON.stringify(values)}`);
        const item = values.Class;
        console.log(`提交数据：grade：${item[0]} class: ${item[1]}`);
        const res = await setExamStatusApi(values.ExamId, 1, item[0], item[1]);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`考核下发失败，系统错误：${msg}`);
            return;
        }
        message.info(`考核下发成功`);
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
