
import { Button, Form, InputNumber, message, Table, TableColumnsType } from 'antd';
import React, { useEffect } from 'react'
import { getExamById, getExamCriteriaApi, saveExamScores } from '../../api/exam';

import { getSizeList } from '../../api/size';
import { generateSizeTableColumns, ISize } from '../size/SizeList'
import { ICriteria } from './CriteriaV2';
import { getCalculatedSizeForExam, IExam, sizeScopeToDelta } from './ExamList';
interface IPropsInput {
    ExamId: number
    callback: () => void
}
interface DataType extends ISize {
    key: React.Key
}

interface ISizeExtended extends ISize {
    defaultScore?: number
}

export default function StandardV2(props: IPropsInput) {
    const { ExamId, callback } = props;
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const Sizes: { Score: number }[] = values.Sizes;
        const table: ISize[] = values.table;
        const total = Sizes.reduce((a, b) => ({ Score: a.Score + b.Score }));
        if (total.Score !== 100) {
            message.error(`分数总和不为100. 当前总和为:${total.Score}.请修改.`);
            return
        }
        let SizeScore: { SizeId: number, Score: number }[] = [];
        table.map((size, index: number) => {
            SizeScore.push({ SizeId: size.Id, Score: Sizes[index].Score });
        })
        const res = await saveExamScores(SizeScore, ExamId);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`保存配分失败，系统错误: ${msg}`);
            return
        }
        message.info(`保存成功`);
        setTimeout(callback, 1000)

    }

    const getSizeWithDefaultScore = async (exam: IExam, sizes: ISize[]): Promise<ISizeExtended[]> => {
        const res = await getExamCriteriaApi(exam.CriteriaId);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`获取考核标准失败，系统错误：${msg}`);
            return sizes;
        }
        //存在未注倒角时，更新count
        const unDeclaredChamfer = sizes.filter((item: ISize) => item.FirstType === 3);
        if (unDeclaredChamfer.length > 0) {
            const criteria = data.filter((item: ICriteria) => item.FirstType === 3);
            if (criteria.length > 0) {
                const other = sizes.filter((item: ISize) => item.FirstType !== 3);
                const newUnDeclaredChamfer = unDeclaredChamfer.map((item: ISize) => ({ ...item, UnDeclaredChamferCount: criteria[0].UnDeclaredChamferCount, UnDeclaredChamferTotalVal: criteria[0].UnDeclaredChamferTotalVal }));
                sizes = [...other, ...newUnDeclaredChamfer]
            }
        }
        //存在表面粗糙度时， 更新默认值。
        const surfCrit = data.filter((item: ICriteria) => item.FirstType === 2);
        const nonSurf = sizes.filter((size: ISize) => size.FirstType !== 2);
        let result: ISizeExtended[] = [];
        surfCrit.map((item: { SurfaceRoughnessVal: string, SurfaceRoughnessScore: string }) => {
            const surfs = sizes.filter((size: ISize) => size.SurfaceRoughnessVal === item.SurfaceRoughnessVal);
            const surfWithScore = surfs.map((size: ISize) => ({ ...size, defaultScore: Number.parseFloat(item.SurfaceRoughnessScore) }));
            result.push(...surfWithScore);
        })
        if (result.length > 0) {
            result.push(...nonSurf.map((size: ISize) => ({ ...size, defaultScore: undefined })));
            return result;
        }
        return sizes;

    }

    const getSizes = async (ExamId: number): Promise<ISize[] | undefined> => {
        console.log(`getSizes CALLED`)
        if (ExamId === 0) {
            return;
        }
        const examRes = await getExamById(ExamId);

        if (examRes.data.code !== 0) {
            message.error(`查询考核信息失败，系统错误:${examRes.data.msg}`);
            return;
        }
        const exam = examRes.data.data;
        const sizes = await getSizeList(1, 100, exam.ExamComponent);
        let { code, msg, data } = sizes.data;
        if (code !== 0) {
            message.error(`查询尺寸数据失败，系统错误:${msg}`);
            return;
        }

        const sizeList = data.map((size: ISize) => {
            size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
            // if (size.FirstType === 3) {
            //     size.OtherRequirements = '***';
            // }
            return size
        })
        console.log(`examRes.data.data:${JSON.stringify(examRes.data.data)}, sizeList: ${JSON.stringify(sizeList)}`)
        sizeList.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType });
        const newSizes = getCalculatedSizeForExam(exam, sizeList, sizeScopeToDelta);
        const SizeExt = await getSizeWithDefaultScore(exam, newSizes);
        form.resetFields(["table"]);
        form.setFieldsValue({
            table: SizeExt
        });
    }

    const generateStandardColumns = () => {
        const fullColumns = generateSizeTableColumns();
        const columns: TableColumnsType<DataType> = [
            ...fullColumns,
            {
                title: '配分',
                key: 'standard',
                render: (_: any, size: ISizeExtended, index) => {
                    if (size.FirstType === 2 && size.defaultScore) {
                        return (
                            <Form.Item name={['Sizes', index, "Score"]}
                                required={true}
                                initialValue={size.defaultScore}
                                rules={[{
                                    required: true,
                                    message: '请设置分数'
                                }]}>
                                <InputNumber min={0} max={100} step={1} disabled={true} />
                            </Form.Item>
                        )
                    }
                    if (size.FirstType === 3 && size.UnDeclaredChamferCount) {
                        return (
                            <Form.Item name={['Sizes', index, "Score"]}
                                required={true}
                                initialValue={size.UnDeclaredChamferTotalVal}
                                rules={[{
                                    required: true,
                                    message: '请设置分数'
                                }]}>
                                <InputNumber min={0} max={100} step={1} disabled={true} />
                            </Form.Item>
                        )
                    }
                    return (
                        <Form.Item name={['Sizes', index, "Score"]}
                            required={true}
                            rules={[{
                                required: true,
                                message: '请设置分数'
                            }]}>
                            <InputNumber min={0} max={100} step={1} />
                        </Form.Item>
                    )
                },
            }
        ]
        return columns;
    }
    useEffect(() => {
        getSizes(ExamId);
    }, [ExamId])

    return (
        <div>
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="table"
                    valuePropName='dataSource'
                >
                    <Table rowKey={record => record.Id} bordered columns={generateStandardColumns()} pagination={false} scroll={{ x: "100%" }} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}


