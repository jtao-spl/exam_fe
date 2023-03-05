import { Button, Form, Input, Select, Space, Tag } from 'antd'
import React from 'react'
import { resetAccountPassword } from '../../api/admin';

export default function PasswordReset() {

    const resetPassword = async(values: any)=>{
        const {type, Name} = values;
        await resetAccountPassword(type, Name);
        return
    }

    return (
        <Space direction='vertical'>
            <Form
                onFinish={resetPassword}
            >
                <Form.Item
                    label='账号类型'
                    name='type'
                    rules={[{
                        required: true,
                        message: '请选择'
                      }]}
                >
                    <Select style={{ width: 240 }}
                    >
                        {
                            ['教师','学生'].map((accountType: string, index: number) =>
                                <Select.Option key={index} value={index}>{accountType}</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                label='Id/Phone'
                name='Name'
                rules={[{
                    required: true,
                    message: '请输入'
                  }]}
                >
                    <Input maxLength={11} placeholder='请输入学生学号或教师联系电话' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>确认</Button>
                </Form.Item>
            </Form>
            <Tag color='red'>提示：密码重置后，登录账号与密码相同。</Tag>
        </Space>
    )
}
