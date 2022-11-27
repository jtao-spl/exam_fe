import { Modal, Select, Form, Tag, Input, Space, Button, Popover, message } from 'antd'
import React, { Component, useState } from 'react';
import { IComponent } from '../component/ComponentList';

import './font.css';
import { saveSize } from '../../api/size';

const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const gdtSymbleArray: Array<string> = ["u", "c", "e", "g", "k", "d", "f", "b", "a", "r", "i", "j", "h", "t"];
const sizeSymbolArray: Array<string> = ['L', 'D', 'R', '∠']
interface IProps {
    visible: boolean
    componentId: number
    callback: (refresh?: boolean) => void
}
export default function AddSizeV2(props: IProps) {
    const { visible, componentId, callback } = props;
    const [showAddSizedInput, setShowAddSizedInput] = useState(false);
    const [showAddGeoToleranceInput, setShowAddGeoToleranceInput] = useState(false);
    const [showAddSurfaceRoughnessInput, setShowAddSurfaceRoughnessInput] = useState(false);
    const [showAddOtherReqirementInput, setShowAddOtherReqirementInput] = useState(false);

    const cancel = () => {
        callback()
    }
    const changeInputType = (values: any) => {
        if (values === 0) {
            setShowAddSizedInput(true);
            setShowAddGeoToleranceInput(false);
            setShowAddSurfaceRoughnessInput(false);
            setShowAddOtherReqirementInput(false);
        }
        if (values === 1) {
            setShowAddSizedInput(false);
            setShowAddGeoToleranceInput(true);
            setShowAddSurfaceRoughnessInput(false);
            setShowAddOtherReqirementInput(false);
        }
        if (values === 2) {
            setShowAddSizedInput(false);
            setShowAddGeoToleranceInput(false);
            setShowAddSurfaceRoughnessInput(true);
            setShowAddOtherReqirementInput(false);
        }
        if (values === 3) {
            setShowAddSizedInput(false);
            setShowAddGeoToleranceInput(false);
            setShowAddSurfaceRoughnessInput(false);
            setShowAddOtherReqirementInput(true);
        }
    }
    const saveSizeData = async (values: any) => {
        const res = await saveSize(values);
        const { code, msg } = res.data;
        if (code === 0) {
            message.success('新建尺寸成功');
            callback(true);
            return
        }
        if (code !== 0) {
            message.error(`新建尺寸失败，系统错误: ${msg}`);
        }

    }
    return (
        <div>
            <Modal
                title='新建尺寸记录'
                onCancel={cancel}
                open={visible}
                footer={null}
            >
                <Form
                    {...layout}
                    onFinish={saveSizeData}
                >
                    <Popover
                        title={null}
                        content={"尺寸数据必须关联到对应的零件上"}
                        placement="topLeft"
                        trigger="click"
                    >
                        <Form.Item
                            label="所属零件"
                            name="ComponentId"
                            initialValue={componentId}
                        >
                            <Tag>{componentId}</Tag>
                        </Form.Item>
                    </Popover>
                    <Popover
                        title={null}
                        content={"选择项目类型后自动加载对应输入字段"}
                        placement="topLeft"
                        trigger="click"
                    >
                        <Form.Item
                            label="项目类型"
                            name="FirstType"
                            required={true}
                            rules={[
                                {
                                    required: true,
                                    message: "请选择项目类型"
                                }
                            ]}
                        >
                            <Select style={{ width: 120 }} onChange={changeInputType}>
                                <Option value={0}><Tag color="blue">零件尺寸检验</Tag></Option>
                                <Option value={1}><Tag color="red">形位公差</Tag></Option>
                                <Option value={2}><Tag color="green">表面粗糙度</Tag></Option>
                                <Option value={3}><Tag color="grey">其他</Tag></Option>
                            </Select>

                        </Form.Item>
                    </Popover>
                    {showAddSizedInput &&
                        <>
                            <Form.Item
                                label="尺寸类型"
                                name="SecondType"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择尺寸类型',
                                    },
                                ]}
                            >
                                <Select style={{ width: 120 }}>
                                    {
                                        sizeSymbolArray.map((symbol: string, index: number) =>
                                            <Option key={symbol} value={index}><Tag color="blue">{symbol}</Tag></Option>
                                        )
                                    }
                                </Select>
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
                        </>
                    }
                    {
                        showAddGeoToleranceInput &&
                        <>
                            <Form.Item
                                label="类型"
                                name="GeoToleranceType"
                                required={true}
                                rules={[
                                    {
                                        required: true,
                                        message: "请选择公差类型"
                                    }
                                ]}>
                                <Select style={{ width: 120 }}>
                                    {
                                        gdtSymbleArray.map((symbol: string) =>
                                            <Option key={symbol} value={symbol}><Tag color="red" className='gdt'>{symbol}</Tag></Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="公差精度"
                                name="GeoToleranceVal"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入有效形位公差精度数据',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    }
                    {
                        showAddSurfaceRoughnessInput &&
                        <>
                            <Form.Item
                                label="粗糙度类别"
                                name="SurfaceRoughnessType"
                                initialValue={"Ra"}>
                                <Tag color="green">{"Ra"}</Tag>
                            </Form.Item>
                            <Form.Item
                                label="粗糙度值"
                                name="SurfaceRoughnessVal"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入有效粗糙度',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    }
                    {
                        showAddOtherReqirementInput &&
                        <>
                            <Form.Item
                                label="其他要求"
                                name="OtherRequirements"
                                rules={[
                                    {
                                        required: true,
                                        message: '输入内容不能为空',
                                    },
                                ]}
                            >
                                <Input placeholder='每次请只输入一条要求' />
                            </Form.Item>
                        </>
                    }
                    <Form.Item>
                        <Space size={"large"} >
                            <Button type='primary' htmlType='reset'>清除</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </Space>

                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}
