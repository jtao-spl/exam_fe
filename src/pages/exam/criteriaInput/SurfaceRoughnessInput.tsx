import { Form, Input, Space } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import React from 'react'
interface IProps{
  form: FormInstance<any>
}
export default function SurfaceRoughnessInput(props:IProps) {
  const {form}= props;
  return (
    <div>
      <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        表面粗糙度
        <Form.Item
          name='SurfaceRoughnessDesc'
          // initialValue={"样块对比目测，符合要求得分"}
          rules={[{required: form.getFieldValue("surfaceRoughnessRequired"),
            message: '请输入'
        }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
      </Space>
    </div>
  )
}
