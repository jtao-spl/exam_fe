
import { Button, Form, InputNumber, message, Modal, Table, TableColumnsType } from 'antd';
import React, { useEffect } from 'react'

import { getSizeList } from '../../api/size';
import { generateSizeTableColumns, ISize } from '../size/SizeList'
interface IProps {
    sizeList: ISize[],
}
interface IPropsInput {
    visible: boolean,
    ExamComponent: number,
    cancel: () => void
}
interface DataType extends ISize {
    key: React.Key
}
export default function Standard(props: IPropsInput) {
    const { visible, ExamComponent, cancel } = props;
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        console.log(` values: ${JSON.stringify(values)};`);
        const Sizes:{Score: number}[] = values.Sizes;
        const total = Sizes.reduce((a, b)=> ({Score: a.Score+b.Score}));
        if(total.Score !== 100){
            message.error(`分数总和不为100. 当前总和为:${total.Score}.请修改.`);
            return
        }

    }
    const getSizes = async (ExamComponent: number): Promise<ISize[] | undefined> => {
        console.log(`getSizes CALLED`)
        const sizes = await getSizeList(1, 100, ExamComponent);
        const { code, msg, data } = sizes.data;
        if (code !== 0) {
            message.error(`查询尺寸数据失败，系统错误:${msg}`);
            return;
        }
        const sizeList = data.map((size: ISize) => {
            size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
            return size
        })
        sizeList.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType });
        form.resetFields(["table"]);
        form.setFieldsValue({
            table: sizeList
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
        getSizes(ExamComponent);

    }, [ExamComponent])

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


