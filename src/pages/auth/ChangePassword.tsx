import { Form, message } from 'antd'
import React from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { changePassword } from '../../api/login';
import { get } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { getHomePage } from '../Login';

export default function ChangePassword() {

  const navigate = useNavigate();

  const changePwd = async (values: any) => {
    console.log(`接收到请求:${JSON.stringify(values)}`);
    if (values.origin !== values.origin2) {
      message.error(`两次输入的原始密码不一致，请重新输入`)
      return;
    }
    if (values.origin === values.newPwd) {
      message.error(`新旧密码不能一致，请重新输入`)
      return;
    }
    if (values.newPwd.length < 6) {
      message.error(`新密码长度不能小于6位，请重新输入`)
      return;
    }
    const res = await changePassword(values.origin, values.newPwd);
    const { code } = res.data;
    if (code !== 0) {
      return
    }
    message.info(`修改密码成功`);
    const page = getHomePage();
    setTimeout(() => {
      navigate(page)
    }, 1000);

  }
  return (
    <div>
      <Space direction="vertical">
        <Form
          onFinish={changePwd}
        >
          <Form.Item
            label='原密码'
            name='origin'
            rules={[{
              required: true,
              message: '请输入'
            }]}
          >
            <Input.Password
              placeholder="请输入"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            label='再次确认原密码'
            name='origin2'
            rules={[{
              required: true,
              message: '请输入'
            }]}
          >
            <Input.Password
              placeholder="请输入"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            label='新密码'
            name='newPwd'
            rules={[{
              required: true,
              message: '请输入'
            }]}
          >
            <Input.Password
              placeholder="请输入"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>确认</Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
