import { Form, InputNumber, Popover, Space, Tag } from 'antd'
import React from 'react'

interface IProps {
  count: number
}

export default function OtherInput(props: IProps) {
  const { count } = props;
  if (count === 0){
    return (<div></div>)
  }
  return (
    <div>
      <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        <React.Fragment
        >
          <Tag style={{ display: 'flex', marginBottom: 8 }} color="grey">未注倒角</Tag>
        </React.Fragment>
        共计
        <Popover
          title={null}
          content={"未注倒角数量修改请在零件编辑流程中修改，已有考核绑定的零件不支持修改。数量为0时不支持设置配分。"}
          placement="topLeft"
          trigger="click"
        >
          <Form.Item
            name='UnDeclaredChamferCount'
            rules={[{
              required: true,
              message: '请输入数量'
            }]}
          >
            <Tag>{count}</Tag>
          </Form.Item>
        </Popover>
        处，总共
        <Form.Item
          name='UnDeclaredChamferTotalVal'
          rules={[{
            required: true,
            message: '请手动输入'
          }]}
        >
          <InputNumber placeholder='请输入总分' disabled={count === 0} min={0} max={100}/>
        </Form.Item>
        分
      </Space>
    </div>
  )
}
