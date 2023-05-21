import { Button, Form, Image, message, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getComponentById } from '../../api/comp';
import { getDeliverDetailById, getExamById, getExamDeliverById } from '../../api/exam';
import { submitExamResult } from '../../api/score';
// import { getToolList } from '../../api/tool';
import { REACT_APP_BASE_API } from '../../config/default';
import { IComponent } from '../../interfaces/Component';
import { IExamInput, ITeacherTableItem } from '../../interfaces/Exam';

import { get } from '../../utils/storage';
import { generateStudentExamTableColumns, generateTableItem, generateTeacherExamTableColumns, getMeasureScore, getTotalScore } from '../../wrapper/Exam';


export default function ExamInput() {
    const navigate = useNavigate();
    const params = useParams();
    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id); //t_exam_deliver的key
    }
    let detailId = 0;
    if (params.detailId) {
        detailId = Number.parseInt(params.detailId);
    }
    const [component, setComponent] = useState<IComponent>();
    // const [tools, setTools] = useState<ITool[]>([]);
    const [items, setItems] = useState<ITeacherTableItem[]>([]);
    const [totalScore, setTotalScore] = useState<string>('');
    const [selfScore, setSelfScore] = useState<number>();
    const [groupScore, setGroupScore] = useState<number>();
    const [form] = Form.useForm();
    const role = get(`role`);

    const generateImgColumns = () => {
        return [{
            title: '展示图样', key: 'clip', render: (_: any, record: IComponent) => {
                return <Image alt="零件图样" width="100%" src={`${REACT_APP_BASE_API}${record.ClipPath}`} />
            }
        }]
    }

    const init = async () => {
        // const res = await getToolList(1, 1000);
        // if (res) {
        //     setTools(res.items);
        // }
        const deliver = await getExamDeliverById(id);
        if (!deliver) return;
        const exam = await getExamById(deliver.ExamId);
        if (!exam) return;

        const component = await getComponentById(exam?.ExamComponent);
        setComponent(component);
        if (!component) return;
        if (role === '3') {
            const items = await generateTableItem(component, exam);
            setItems(items);
            form.setFieldsValue({
                table: items
            })
        } else {
            const detail = await getDeliverDetailById(detailId);
            if (!detail) return;
            setSelfScore(detail.SelfScore);
            setGroupScore(detail.GroupScore);
            const items = await generateTableItem(component, exam, detail);
            setItems(items);
            form.setFieldsValue({
                table: items
            })
        }
    }
    useEffect(() => {
        form.setFieldsValue({ table: items })
    }, [items])

    const onUpdateResult = (values: any) => {
        console.log(`values: ${JSON.stringify(values)}`);
        //更新测量尺寸时：[{"touched":true,"validating":false,"errors":[],"warnings":[],"name":["Sizes",2,"size"],"value":1}]
        const [_, index, inputType] = values[0].name;
        if (inputType === 'size') {
            const value = values[0].value;
            if (index < items.length) {
                const item = items.at(index);
                if (!item) return;
                const newItems = items.filter((i: ITeacherTableItem) => item.id !== i.id);
                const result = getMeasureScore(item, value);
                console.log(`当前数据: ${JSON.stringify(item)}`);
                console.log(`尺寸检验结果:${result}`);
                const newItem = { ...item, result: result };
                newItems.push(newItem);
                newItems.sort((a: ITeacherTableItem, b: ITeacherTableItem) => a.id - b.id);
                const totalScore = getTotalScore(newItems);
                setTotalScore(totalScore);
                setItems(newItems);
            }
        }
    }

    useEffect(() => {
        init()
    }, [])

    const submitExamData = async (values: any) => {
        console.log(`提交成绩数据：${JSON.stringify(values)}`);
        const tables: ITeacherTableItem[] = values.table;
        const Inputs: { tool?: number, size: number }[] = values.Sizes;
        if (tables.length !== Inputs.length) {
            message.error(`系统异常，获取的尺寸数据长度与原始不一致。`)
            return;
        }
        const emptyInput = tables.filter((item: ITeacherTableItem) => item.result === '待定');
        if (emptyInput.length > 0) {
            message.error(`存在"待定"状态的输入项，请修正后提交。`);
            return;
        }
        const rawInput: IExamInput[] = tables.map((item: ITeacherTableItem, index: number) => {
            return {
                sizeId: item.id,
                score: typeof item.result === "string" ? Number.parseFloat(item.result) : item.result,
                value: Inputs[index].size,
                // toolId: Inputs[index].tool
            }
        })
        const res = await submitExamResult(rawInput, totalScore, detailId);
        if (!res) return;
        message.info(`提交成功，即将跳转`);
        setTimeout(() => {
            navigate(-1);
        }, 1000);
    }

    return (
        <div>
            <Button type='primary' onClick={() => navigate(-1)}>返回</Button>
            {component &&
                <Table
                    bordered
                    rowKey={record => record.Id}
                    columns={generateImgColumns()}
                    dataSource={[component]}
                    pagination={false}
                />
            }
            {items &&
                <Form form={form} onFieldsChange={onUpdateResult} onFinish={submitExamData}>
                    <Form.Item name="table"
                        valuePropName='dataSource'
                    >
                        <Table
                            size="small"
                            bordered={true}
                            rowKey={record => record.id}
                            columns={role === '3' ? generateStudentExamTableColumns() : generateTeacherExamTableColumns()}
                            dataSource={items}
                            pagination={false}
                            scroll={{y: 400, x: 1300}}
                            summary={() => {
                                if (role === "3") return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row style={{ textAlign: 'center' }}>
                                            <Table.Summary.Cell index={0} colSpan={7}>得分</Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>{totalScore}</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row style={{ textAlign: 'center' }}>
                                            <Table.Summary.Cell index={0} colSpan={7}>得分</Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>{selfScore}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>{groupScore}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>{totalScore}</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType='submit'>提交考核</Button>
                    </Form.Item>
                </Form>
            }
        </div >
    )
}
