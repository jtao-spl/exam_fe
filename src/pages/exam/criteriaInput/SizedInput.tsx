import { Form, InputNumber, Space, Tag } from 'antd'
import React from 'react'
import { IEntity } from '../CriteriaV2'
interface IProps {
    SizedEntity:IEntity[]
}
export default function SizedInput(props:IProps) {
    const {SizedEntity} =props;

    return (
        <div>
             <Form.List name="SizedElement" >
                {(fields) => (
                    <React.Fragment>
                        {fields.map(({ key, name, ...restField }) => 
                        (<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <React.Fragment
                            >
                                <Tag style={{ display: 'flex', marginBottom: 8 }} color="blue">{SizedEntity[key].name}:{SizedEntity[key].symbol}</Tag>
                            </React.Fragment>
                            偏差范围以得分，偏差范围外每超差
                            <Form.Item
                                {...restField}
                                name={[name, 'SizeDelta']}
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <InputNumber min={0.01} max={1} step={0.01} />
                            </Form.Item>
                            扣
                            <Form.Item
                                {...restField}
                                name={[name, 'SizeDeductScore']}
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


            {/* <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                <React.Fragment
                >
                    <Tag style={{ display: 'flex', marginBottom: 8 }} color="blue">{name}:{symbol}</Tag>
                </React.Fragment>
                偏差范围以得分，偏差范围外每超差
                <Form.Item
                    name={`${symbol}[0]`}
                    initialValue={0.01}
                    rules={rules}
                >
                    <InputNumber min={0.01} max={1} step={0.01} />
                </Form.Item>
                扣
                <Form.Item
                    name={`${symbol}[1]`}
                    initialValue={1}
                    rules={rules}
                >
                    <InputNumber min={1} max={100} step={1} value={1} />
                </Form.Item>
                分，配分扣完为止
            </Space> */}
        </div>
    )
}
