import { Button, Form, Input, InputNumber, message, Modal, Space, Tag } from 'antd'
import React from 'react'

import './font.css';
import { updateSize } from '../../api/size';
import { IEditSizeProps } from '../../interfaces/Size';


export default function EditSize(props:IEditSizeProps) {
    const {size, cancel,visible} = props;
    const onCancel = () => {
        cancel()
    }
    const updateSizeFunc = async (values: any) => {
        if (!size) {
            message.error(`更新零件尺寸异常：当前未指定任何尺寸`);
            return
        }
        const res = await updateSize(size, values);
        if(res){
            cancel(true);
            return;
        }
    }


    return (
        <div>
            {
                size?.FirstType === 0 &&
                <Modal
                    title="编辑组件"
                    open={visible}
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form
                        onFinish={updateSizeFunc}
                    >
                        <Form.Item
                            label="Id"
                            name="尺寸ID"
                        // initialValue={size?.Id}
                        >
                            <Tag color={size?.Color}>{size?.Id}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="零件ID"
                            name="ComponentId"
                        // initialValue={size?.ComponentId}
                        >
                            <Tag color={size?.Color}>{size?.ComponentId}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="项目类型"
                            name="FirstType"
                        // initialValue={size?.FirstType}
                        >
                            <Tag color={size?.Color}>零件尺寸检验</Tag>
                        </Form.Item>
                        <Form.Item
                            label="类型"
                            name="SecondType"
                        // initialValue={size?.SecondType}
                        >
                            <Tag color={size?.Color}>{size?.SecondType === 0 ? "L" : size?.SecondType === 1 ? "D" : size?.SecondType === 2 ? "R" : size?.SecondType === 3 ? "∠" : ""}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="基准值"
                            name="BaseSize"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入有效数值',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="上偏差"
                            name="UpSize"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入有效数值'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="下偏差"
                            name="BottomSize"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入有效数值'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Space size={"large"} >
                                <Button type='primary' htmlType='reset'>清除</Button>
                                <Button type='primary' htmlType='submit'>保存</Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Modal>
            }
            {
                size?.FirstType === 1 &&
                <Modal
                    title="编辑组件"
                    open={visible}
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form
                        onFinish={updateSizeFunc}
                    >
                        <Form.Item
                            label="Id"
                            name="尺寸ID"
                        >
                            <Tag color={size?.Color}>{size?.Id}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="零件ID"
                            name="ComponentId"
                        >
                            <Tag color={size?.Color}>{size?.ComponentId}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="项目类型"
                            name="FirstType"
                        >
                            <Tag color={size?.Color}>形位公差</Tag>
                        </Form.Item>
                        <Form.Item
                            label="类型"
                            name="GeoToleranceType"
                        >
                            <Tag color={size?.Color} className={"gdt"}>{size?.GeoToleranceType}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="公差精度"
                            name="GeoToleranceVal"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Space size={"large"} >
                                <Button type='primary' htmlType='reset'>清除</Button>
                                <Button type='primary' htmlType='submit'>保存</Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Modal>
            }
            {
                size?.FirstType === 2 &&
                <Modal
                    title="编辑组件"
                    open={visible}
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form
                        onFinish={updateSizeFunc}
                    >
                        <Form.Item
                            label="Id"
                            name="尺寸ID"
                        >
                            <Tag color={size?.Color}>{size?.Id}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="零件ID"
                            name="ComponentId"
                        >
                            <Tag color={size?.Color}>{size?.ComponentId}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="项目类型"
                            name="FirstType"
                        >
                            <Tag color={size?.Color}>表面粗糙度</Tag>
                        </Form.Item>
                        <Form.Item
                            label="粗糙度类别"
                            name="SurfaceRoughnessType"
                        >
                            <Tag color={size?.Color}>{size?.SurfaceRoughnessType}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="粗糙度值"
                            name="SurfaceRoughnessVal"
                        >
                            <Tag color={size?.Color}>{size?.SurfaceRoughnessVal}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="数量"
                            name="SurfaceRoughnessCount"
                        >
                            <InputNumber defaultValue={size?.SurfaceRoughnessCount}/>
                        </Form.Item>
                        <Form.Item>
                            <Space size={"large"} >
                                <Button type='primary' htmlType='reset'>清除</Button>
                                <Button type='primary' htmlType='submit'>保存</Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Modal>
            }
            {
                size?.FirstType === 3 &&
                <Modal
                    title="编辑组件"
                    open={visible}
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form
                        onFinish={updateSizeFunc}
                    >
                        <Form.Item
                            label="Id"
                            name="尺寸ID"
                        >
                            <Tag color={size?.Color}>{size?.Id}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="零件ID"
                            name="ComponentId"
                        >
                            <Tag color={size?.Color}>{size?.ComponentId}</Tag>
                        </Form.Item>
                        <Form.Item
                            label="项目类型"
                            name="FirstType"
                        >
                            <Tag color={size?.Color}>未注倒角</Tag>
                        </Form.Item>
                       
                        <Form.Item
                            label="数量"
                            name="UnDeclaredChamferCount"
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item>
                            <Space size={"large"} >
                                <Button type='primary' htmlType='reset'>清除</Button>
                                <Button type='primary' htmlType='submit'>保存</Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Modal>
            }
        </div>
    )

}
