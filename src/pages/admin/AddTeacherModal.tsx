import { Button, Input, Modal, Space } from 'antd';
import React from 'react'
import { Form } from 'antd';
import { IAddTeacherProps } from '../../interfaces/Teacher';
import { createTeacher } from '../../api/admin';

export default function AddTeacherModal(props: IAddTeacherProps) {
  const { open, callback } = props;

  const saveTeacher = async (values: any) => {
    const { Name, Phone } = values;
    const resp = await createTeacher(Name, Phone);
    if (resp) {
      callback()
    }
  }

  return (
    <div>
      <Modal
        title="录入教师"
        open={open}
        footer={null}
        onCancel={() => callback()}
      >
        <Form
          onFinish={saveTeacher}
        >
          <Form.Item
            label='姓名'
            name='Name'
            rules={[{
              required: true,
              message: '请输入'
            }]}
          >
            <Input max={20} />
          </Form.Item>
          <Form.Item
            label='联系电话'
            name='Phone'
            rules={[{
              required: true,
              message: '请输入'
            }]}
          >
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button type='primary' htmlType='reset'>清除</Button>
              <Button type='primary' htmlType='submit'>保存</Button>
            </Space>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}
