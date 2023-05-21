import { Button, Form, InputNumber, message, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { batchUpdateSizePrecision, getExamById } from '../../api/exam';
import { IEditPrecisionProps, ISize, ISizePrecisionData } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';


export default function EditPrecision(props: IEditPrecisionProps) {
    const { examId, level, callback } = props;
    const [form] = Form.useForm();
    const [sizes, setSizes] = useState<ISize[]>();
    const getSizedSizes = async (examId: number) => {
        const exam = await getExamById(examId);
        if(!exam) return;

        const sizes = await getSizesByComponentId(exam.ExamComponent);
        if (!sizes) return;
        const sizedItem = sizes.filter((s: ISize) => s.FirstType === 0);
        form.setFieldsValue({
            "table": sizedItem
        })
        setSizes(sizedItem);
    }

    useEffect(() => {
        getSizedSizes(examId)
    }, [])

    const onFinish = async(values: any) => {
        const sizes:any = values.table;
        const req:ISizePrecisionData[] = sizes.map((size:any)=>({
            Id: size.Id,
            UpSize: size.UpSize,
            BottomSize: size.BottomSize
        }))
        const invalidInput = req.filter((item:ISizePrecisionData)=>item.UpSize < item.BottomSize);
        if(invalidInput.length >0){
            message.error(`校验失败：输入中存在上偏差小于下偏差，请修正后重新提交`);
            return;
        }
        const res = await batchUpdateSizePrecision(examId, req);
        if(!res) return;
        callback()
    }

    const onFinishMini = async()=>{
        const res = await batchUpdateSizePrecision(examId, []);
        if(!res) return;
        callback()
    }

    if (level !== 4) {
        return (<div>
            创建考核时已选择具体的线性尺寸公差等级，此处无需编辑。
            <Button type='primary' onClick={onFinishMini}>下一步</Button>
        </div>)
    }
    return (
        <div>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off"
            >
                <PrecisionInput sizes={sizes} />
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>


        </div>
    )
}


interface IProps2 {
    sizes?: ISize[],
}
function PrecisionInput(props: IProps2) {
    const { sizes } = props;
    return (
        <div>
            <Tag color="blue">默认值为系统解析的原始偏差数据。</Tag>
            <Form.List name="table" >
                {(fields) => (
                    <React.Fragment>
                        {fields.map(({ key, name, ...restField }) =>
                        (<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            {sizes?.at(key)?.SecondType === 0 ? <Tag color='blue'>线性尺寸L</Tag> :
                                sizes?.at(key)?.SecondType === 1 ? <Tag color='blue'>直径尺寸D</Tag> :
                                    sizes?.at(key)?.SecondType === 2 ?
                                        <Tag color='blue'>半径尺寸R</Tag> : <Tag color='blue'>角度尺寸∠</Tag>}{<Tag>{sizes?.at(key)?.BaseSize}</Tag>} 上偏差
                            <Form.Item
                                {...restField}
                                name={[name, 'UpSize']}
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <InputNumber min={0} />
                            </Form.Item>
                            下偏差
                            <Form.Item
                                {...restField}
                                name={[name, 'BottomSize']}
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Space>)

                        )}
                    </React.Fragment>
                )
                }
            </Form.List>
        </div>
    )
}
