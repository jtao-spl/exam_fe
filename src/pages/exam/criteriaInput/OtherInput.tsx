import { Form, InputNumber, Space, Tag } from 'antd'
import React from 'react'

export default function OtherInput() {
  return (
    <div>
      <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        <React.Fragment
        >
          <Tag style={{ display: 'flex', marginBottom: 8 }} color="grey">未注倒角</Tag>
        </React.Fragment>
        共计
        <Form.Item
          name='UnDeclaredChamferCount'
          rules={[{
            required: true,
            message: '请输入'
          }]}
        >
          <InputNumber placeholder='请输入' />
        </Form.Item>
        处，总共
        <Form.Item
          name='UnDeclaredChamferTotalVal'
          rules={[{
            required: true,
            message: '请手动输入'
          }]}
        >
          <InputNumber placeholder='请输入总分' />
        </Form.Item>
        分
      </Space>
    </div>
  )
}
