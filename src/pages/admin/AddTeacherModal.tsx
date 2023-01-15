import { Button, Input, message, Modal, Space } from 'antd';
import React from 'react'
import { Form } from 'antd';
import { createTeacher } from '../../api/admin';


interface Iprops {
  open: boolean,
  callback: () => void
}
export default function AddTeacherModal(props: Iprops) {
  const { open, callback } = props;

  const saveTeacher = async(values: any) => {
    console.log(`接收到请求: values: ${JSON.stringify(values)}`)
    const {Name, Phone} = values;
    const res = await createTeacher(Name,Phone);
    const {code, msg} = res.data;
    if(code !==0){
      message.error(`录入教师信息失败，系统错误: ${msg}`);
      return
    }
    message.info(`录入成功`);
    callback()
  }

  return (
    <div>
      <Modal
        title="录入教师"
        open={open}
        footer={null}
        onCancel={()=>callback()}
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
