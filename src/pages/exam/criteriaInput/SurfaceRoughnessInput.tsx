import { Form, InputNumber, Space, Tag } from 'antd'
import React from 'react'
import { IEntityRequired } from '../../../interfaces/ExamCriteria';

interface IProps {
  surfaceRoughness: IEntityRequired[]
}
export default function SurfaceRoughnessInput(props: IProps) {
  const { surfaceRoughness } = props;
  return (
    <div>
      <Form.List name="surfaceRoughnessElement" >
        {(fields) => (
          <React.Fragment>
            {fields.map(({ key, name, ...restField }) =>
            (<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <React.Fragment
              >
                <Tag style={{ display: 'flex', marginBottom: 8 }} color="green">表面粗糙度:Ra{surfaceRoughness[key].size}</Tag>
              </React.Fragment>
              共计<Tag color="green">{surfaceRoughness[key].count}</Tag>处，总共
              <Form.Item
                {...restField}
                name={[name, 'surfaceRoughnessTotalScore']}
                rules={[{ required: true, message: '请输入' }]}
              >
                <InputNumber min={0} max={100} step={1} />
              </Form.Item>
              分

            </Space>)

            )}
          </React.Fragment>
        )}
      </Form.List>
    </div>
  )
}
