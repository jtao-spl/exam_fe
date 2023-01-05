import { Form, InputNumber, Space, Tag } from 'antd'
import React from 'react'
import { IEntity } from '../CriteriaV2'
interface IProps {
  GeoToleranceEntity: IEntity[]
}
export default function GeoToleranceInput(props: IProps) {
  const { GeoToleranceEntity } = props;
  return (
    <div>
      <Form.List name="GeoElement" >
        {(fields) => (
          <React.Fragment>
            {fields.map(({ key, name, ...restField }) =>
            (<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <React.Fragment
              >
                <Tag style={{ display: 'flex', marginBottom: 8 }} color="red" className='gdt'>{GeoToleranceEntity[key].name}:{GeoToleranceEntity[key].symbol}</Tag>
              </React.Fragment>
              低于
              <Form.Item
                {...restField}
                name={[name, 'GeoBase']}
                rules={[{ required: true, message: '请输入' }]}
              >
                <InputNumber min={0.01} max={1} step={0.01} value={0.01} />
              </Form.Item>
              得分，超过后每超差
              <Form.Item
                {...restField}
                name={[name, 'GeoDelta']}
                rules={[{ required: true, message: '请输入' }]}
              >
                <InputNumber min={0.01} max={1} step={0.01} value={0.01} />
              </Form.Item>
              扣
              <Form.Item
                {...restField}
                name={[name, 'GeoDeductScore']}
                rules={[{ required: true, message: '请输入' }]}
              >
                <InputNumber min={1} max={100} step={1} value={1} />
              </Form.Item>
              分，配分扣完为止


            </Space>)

            )}
          </React.Fragment>
        )}
      </Form.List>

    </div>
  )
}
