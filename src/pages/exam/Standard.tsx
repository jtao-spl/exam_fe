
import { Button, Form, InputNumber, message, Modal, Table, TableColumnsType } from 'antd';
import React, { useEffect } from 'react'
import { getExamById, saveExamScores } from '../../api/exam';

import { getSizeList } from '../../api/size';
import { generateSizeTableColumns, ISize } from '../size/SizeList'
import { getCalculatedSizeForExam, sizeScopeToDelta } from './ExamList';
interface IProps {
    sizeList: ISize[],
}
interface IPropsInput {
    visible: boolean,
    ExamId: number,
    cancel: () => void
}
interface DataType extends ISize {
    key: React.Key
}
export default function Standard(props: IPropsInput) {
    const { visible, ExamId, cancel } = props;
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const Sizes:{Score: number}[] = values.Sizes;
        const table: ISize[] = values.table;
        const total = Sizes.reduce((a, b)=> ({Score: a.Score+b.Score}));
        if(total.Score !== 100){
            message.error(`分数总和不为100. 当前总和为:${total.Score}.请修改.`);
            return
        }
        let SizeScore:{SizeId:number,Score:number}[] = [];
        table.map((size, index:number)=>{
            SizeScore.push({SizeId: size.Id, Score: Sizes[index].Score});
        })
        const res = await saveExamScores(SizeScore, ExamId);
        const {code, msg} = res.data;
        if(code !== 0){
            message.error(`保存配分失败，系统错误: ${msg}`);
            return
        }
        message.info(`保存成功`);
        cancel()

    }
    const getSizes = async (ExamId: number): Promise<ISize[] | undefined> => {
        console.log(`getSizes CALLED`)
        if(ExamId === 0){
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
            // if(size.FirstType === 3){
            //     size.UnDeclaredChamferCount = '***';
            // }
            return size
        })
        console.log(`examRes.data.data:${JSON.stringify(examRes.data.data)}, sizeList: ${JSON.stringify(sizeList)}`)
        sizeList.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType });
        const newSizes = getCalculatedSizeForExam(exam, sizeList, sizeScopeToDelta);
        console.log(`get new Sizes: ${JSON.stringify(newSizes)}`)
        form.resetFields(["table"]);
        form.setFieldsValue({
            table: newSizes
        });
    }

    const generateStandardColumns = () => {
        const fullColumns = generateSizeTableColumns();
        const columns: TableColumnsType<DataType> = [
            ...fullColumns,
            {
                title: '配分',
                key: 'standard',
                render: (_: any, size: ISize, index) => {
                    return (
                        <Form.Item name={['Sizes', index, "Score"]}
                            required={true}
                            rules={[{
                                required: true,
                                message: '请设置分数'
                            }]}>
                            <InputNumber min={0} max={100} step={1}/>
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
            <Modal
                title="设置零件配分"
                open={visible}
                footer={null}
                width={"80vw"}
                onCancel={() => cancel()}>

                <Form form={form} onFinish={onFinish}>
                    <Form.Item name="table"
                        valuePropName='dataSource'
                    >
                        <Table bordered columns={generateStandardColumns()} pagination={false} scroll={{ x: "100%" }} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}


