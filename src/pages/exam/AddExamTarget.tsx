import { Button, Form, Input, message } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { saveExamTarget } from '../../api/exam'

export default function AddExamTarget() {
    const navigate = useNavigate();
    const saveNewTarget = async (values: any) => {
        const res = await saveExamTarget(values.Name);
        if(!res) return;
        setTimeout(() => {
            navigate(-1);
        }, 200);
    }
    return (
        <Form
            onFinish={saveNewTarget}
        >
            <Form.Item
                label="考核项目"
                name="Name"
                rules={[{
                    required: true,
                    message: '请输入考核项目'
                }]}>
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit'>新建</Button>
            </Form.Item>
        </Form>
    )
}
