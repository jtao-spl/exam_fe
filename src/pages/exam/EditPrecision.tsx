import { Button, Form, InputNumber, message, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { batchUpdateSizePrecision, getExamById } from '../../api/exam';
import { getSizeList } from '../../api/size';
import { ISize } from '../size/SizeList';


interface IProps {
    examId: number,
    level: number,
    callback: () => void
}

export interface ISizePrecisionData {
    Id: number,
    UpSize: number,
    BottomSize: number
}

export default function EditPrecision(props: IProps) {
    const { examId, level, callback } = props;
    const [form] = Form.useForm();
    const [sizes, setSizes] = useState<ISize[]>();
    const getSizedSizes = async (examId: number) => {
        const res = await getExamById(examId);
        const { code, msg, data } = res.data;
        if (code !== 0) {
            message.error(`获取考核信息失败,系统错误：${msg}`);
            return
        }

        const sizes = await getSizeList(1, 100, data.ExamComponent);
        if (sizes.data.code !== 0) {
            message.error(`查询尺寸数据失败，系统错误:${sizes.data.msg}`);
            return;
        }
        const sizedItem = sizes.data.data.filter((s: ISize) => s.FirstType === 0);
        form.setFieldsValue({
            "table": sizedItem
        })
        setSizes(sizedItem);
    }

    useEffect(() => {
        getSizedSizes(examId)
    }, [])

    const onFinish = async(values: any) => {
        console.log(`请求: ${JSON.stringify(values)}`);
        const sizes:any = values.table;
        const req = sizes.map((size:any)=>({
            Id: size.Id,
            UpSize: size.UpSize,
            BottomSize: size.BottomSize
        }))
        const res = await batchUpdateSizePrecision(examId, req);
        const {code, msg, data} = res.data;
        if(code !== 0){
            message.error(`保存失败，系统错误：${msg}, 请稍后重试`);
            return
        }
        message.info(`保存成功`);
        callback()
    }

    if (level !== 4) {
        return (<div>
            创建考核时已选择具体的线性尺寸公差等级，此处无需编辑。
            <Button type='primary' onClick={callback}>下一步</Button>
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
            <Tag color="red">下偏差需要输入有效负数或0，默认值为系统解析的原始偏差数据。</Tag>
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
                                <InputNumber min={0} max={99.99}/>
                            </Form.Item>
                            下偏差
                            <Form.Item
                                {...restField}
                                name={[name, 'BottomSize']}
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <InputNumber max={0} min={-99.99} />
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
