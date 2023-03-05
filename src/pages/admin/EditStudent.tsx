import { Button, Cascader, Form, Input, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { updateStudentInfo } from '../../api/student';
import { IEditStudentProps } from '../../interfaces/Student';
import { Option } from '../../interfaces/Student';
import { getOptions } from '../../wrapper/Student';

export default function EditStudent(props: IEditStudentProps) {
    const { student, visible, callback } = props;
    const [options, setOptions] = useState<Option[]>([])
    const getOpts = async () => {
        const options = await getOptions();
        setOptions(options);
    }
    useEffect(() => {
        getOpts()
    }, [])
    const update = async (values: any) => {
        console.log(`更新学生信息:${JSON.stringify(values)}`);
        const { StudentId, Name, Class } = values;
        const Grade = Class[0];
        const arr = Class[1].split('-');

        const res = await updateStudentInfo({
            StudentId: StudentId,
            Name: Name,
            Grade: Grade,
            Major: arr[0],
            Class: Number.parseInt(arr[1])
        });
        if (res) callback({})
    }
    if (!student) {
        return (<div></div>)
    }
    return (
        <div>
            <Modal
                title="修改学生信息"
                open={visible}
                footer={null}
                onCancel={() => callback({})}
            >
                <Form
                    onFinish={update}
                >
                    <Form.Item
                        label='学号'
                        name='StudentId'
                        initialValue={student.StudentId}>
                        <Tag>{student.StudentId}</Tag>
                    </Form.Item>
                    <Form.Item
                        label='姓名'
                        name='Name'
                        initialValue={student.Name}
                        rules={[{
                            required: true,
                            message: '请输入'
                        }]}
                    >
                        <Input max={20} />
                    </Form.Item>
                    <Form.Item
                        label='班级'
                        name='Class'
                        initialValue={[`${student.Grade}级`, `${student.Major}-${student.Class}班`]}
                        rules={[{
                            required: true,
                            message: '请输入'
                        }]}
                    >
                        <Cascader
                            style={{ width: '100%' }}
                            options={options}
                            // onChange={onChange}
                            // multiple
                            maxTagCount="responsive"
                            placeholder="请选择班级" />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ float: 'right' }}>
                            <Button type='primary' htmlType='reset'>重置</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
