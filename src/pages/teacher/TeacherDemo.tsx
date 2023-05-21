import { Button, Form, FormInstance, Image, Input, InputNumber, InputRef, Select, Table, TableColumnsType, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getComponentById } from '../../api/comp';
import { getExamById } from '../../api/exam';
import { getToolList } from '../../api/tool';
import { REACT_APP_BASE_API } from '../../config/default';
import { IComponent, ITool } from '../../interfaces/Component';
import { IExam } from '../../interfaces/Exam';
import { ISize } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { getCalculatedSizeForExam, getMeasureResult, getSummary } from '../../wrapper/Exam';


export interface IDemoTableItem {
    id: number,
    // clip: any,
    size: ISize,
    project: string | any,
    baseSize: number | string,
    upSize: number | string,
    bottomSize: number | string,
    toolId: number,
    result: string
}

export default function TeacherDemo() {
    const navigate = useNavigate();
    const params = useParams();
    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id);
    }
    const [exam, setExam] = useState<IExam>();
    const [component, setComponent] = useState<IComponent>();
    const [sizes, setSizes] = useState<ISize[]>([]);
    const [tools, setTools] = useState<ITool[]>([]);
    const [items, setItems] = useState<IDemoTableItem[]>([]);
    const [summary, setSummary] = useState<string>('待定');
    const [form] = Form.useForm();

    const generateTeacherDemoTableColumns = () => {
        const columns: TableColumnsType<IDemoTableItem> = [
            {
                title: '教师测量示范模块', key: 'teacherDemo', children: [
                    {
                        title: '检测项目内容', key: 'content', children: [
                            { title: '检测类别', key: 'type', dataIndex: 'project' },
                            {
                                title: '检测要求', key: 'requirement', children: [
                                    {
                                        title: '基本尺寸', key: 'baseSize', dataIndex: 'baseSize',
                                    },
                                    {
                                        title: '上偏差', key: 'upSize', dataIndex: 'upSize',
                                    },
                                    {
                                        title: '下偏差', key: 'bottomSize', dataIndex: 'bottomSize',
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        title: '检测结果', key: 'result', children: [
                            {
                                title: '测量工具', key: 'tool', render: (_: any, record: IDemoTableItem, index: number) => {
                                    return <Select style={{ width: 120 }}>
                                        {
                                            tools.map((tool: ITool) =>
                                                (<Select.Option key={tool.Id} value={tool.Id}>{tool.Name}</Select.Option>)
                                            )
                                        }
                                    </Select>
                                }
                            },
                            {
                                title: '测量尺寸', key: 'input', render: (_: any, record: IDemoTableItem, index: number) => {
                                    return <Form.Item name={['Sizes', index, "size"]}
                                        required={true}
                                        rules={[{
                                            required: true,
                                            message: '请输入测量尺寸'
                                        }]}
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                }
                            },
                            {
                                title: '结果判定', key: 'sizeResult', dataIndex: 'result'
                            }
                        ]
                    }
                ]
            }
        ]
        return columns;
    }
    const generateImgColumns = () => {
        return [{
            title: '展示图样', key: 'clip', render: (_: any, record: IComponent) => {
                return <Image alt="零件图样" width="100%" src={`${REACT_APP_BASE_API}${record.ClipPath}`} />
            }
        }]
    }

    const init = async () => {
        const res = await getToolList(1, 1000);
        if (res) {
            setTools(res.items);
        }
        const exam = await getExamById(id);
        setExam(exam);
        if (exam) {
            const component = await getComponentById(exam?.ExamComponent);
            setComponent(component);
            if (component) {
                const sizes = await getSizesByComponentId(component.Id);
                const calSizes = getCalculatedSizeForExam(exam, sizes);
                const filterdSizes = calSizes.filter((size: ISize) => [0, 1, 2].includes(size.FirstType))
                setSizes(filterdSizes);
                const items: IDemoTableItem[] = filterdSizes.map((size: ISize) => {
                    return {
                        id: size.Id,
                        // clip: 'aaa',
                        size: size,
                        project: size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 0 ? '线性（L）' :
                            size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 1 && size.DiameterType !== undefined && size.DiameterType === 2 ? '内径（d）' :
                                size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 1 ? '外径（D）' :
                                    size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 2 ? '半径（r）' :
                                        size.FirstType === 0 && size.SecondType !== undefined && size.SecondType === 3 ? '角度（∠）' :
                                            size.FirstType === 1 ? <span className='gdt'>{`形位公差（${size.GeoToleranceType}）`}</span> :
                                                size.FirstType === 2 ? `表面粗糙度(Ra)` : `未知FirstType：${size.FirstType}`,
                        baseSize: size.FirstType === 0 && size.BaseSize !== undefined ? size.BaseSize :
                            size.FirstType === 1 && size.GeoToleranceVal !== undefined ? size.GeoToleranceVal :
                                size.FirstType === 2 && size.SurfaceRoughnessVal !== undefined ? size.SurfaceRoughnessVal : 0,
                        upSize: size.FirstType === 0 && size.UpSize !== undefined ? size.UpSize : '-',
                        bottomSize: size.FirstType === 0 && size.BottomSize !== undefined ? size.BottomSize : '-',
                        toolId: 1,
                        result: `待定`
                    }
                })
                items.sort((a: IDemoTableItem, b: IDemoTableItem) => a.id - b.id)
                setItems(items);
                form.setFieldsValue({
                    table: items
                })
            } else {
                return;
            }
        }
        else {
            return;
        }
    }
    useEffect(() => {
        form.setFieldsValue({ table: items })
    }, [items])

    const onUpdateResult = (values: any) => {
        console.log(`values: ${JSON.stringify(values)}`);
        //更新测量工具时：[{"touched":true,"validating":false,"errors":[],"warnings":[],"name":["Sizes",2,"Tool"],"value":4}]
        //更新测量尺寸时：[{"touched":true,"validating":false,"errors":[],"warnings":[],"name":["Sizes",2,"size"],"value":1}]
        const [_, index, inputType] = values[0].name;
        if (inputType === 'size') {
            const value = values[0].value;
            if (index < items.length) {
                const item = items.at(index);
                if (!item) return;
                const newItems = items.filter((i: IDemoTableItem) => item.id !== i.id);
                const result = getMeasureResult(item, value);
                console.log(`当前数据: ${JSON.stringify(item)}`);
                console.log(`尺寸检验结果:${result}`);
                const newItem = { ...item, result: result };
                newItems.push(newItem);
                newItems.sort((a: IDemoTableItem, b: IDemoTableItem) => a.id - b.id);
                const summary = getSummary(newItems);
                setSummary(summary);
                setItems(newItems);
            }
        }
    }

    useEffect(() => {
        //第一步获取考核关联的组件元素信息，然后组装表格，待填项赋默认值，输入时动态刷新
        //TODO: 需要在前置的零件设置的时候，针对直径数据，要求必填是内径还是外径
        //新增测量工具的编排选择能力
        //新增展示时的入库 报废 返工 未知 评测标准
        init()
    }, [])
    return (
        <div>
            <Button type='primary' onClick={() => navigate(-1)}>返回</Button>
            {component &&
                <Table
                    bordered
                    columns={generateImgColumns()}
                    dataSource={[component]}
                    pagination={false}
                />
            }
            {items &&
                <Form form={form} onFieldsChange={onUpdateResult}>
                    <Form.Item name="table"
                        valuePropName='dataSource'
                    >
                        <Table
                            bordered={true}
                            rowKey={record => record.id}
                            columns={generateTeacherDemoTableColumns()}
                            dataSource={items}
                            pagination={false}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ textAlign: 'center' }}>
                                        <Table.Summary.Cell index={0} colSpan={6}>工件判定</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>{summary}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </Form.Item>
                </Form>
            }
        </div>
    )
}
