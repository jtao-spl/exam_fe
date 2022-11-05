import { Form, Input, Space } from 'antd'
import React from 'react'

export default function OtherInput() {
  return (
    <div>
        <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        其他项
        <Form.Item
          name='OtherDesc'
          rules={[{required: true,
            message: '请输入'
        }]}
        >
          <Input placeholder='请输入'/>
        </Form.Item>
      </Space>
    </div>
  )
}
