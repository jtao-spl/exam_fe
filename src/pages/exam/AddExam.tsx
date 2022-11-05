import { Form, Modal, TimePicker, Button, Tag, Input, Space, Select, message, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveExam } from '../../api/exam';
import { IComponent } from '../component/ComponentList';

/**
 * 添加考试
 * 基本信息管理
 * 考核日期：时间组件
 * 考核时间：几点几分
 * 交件时间  几点几分
 * 班级：自填
 * 姓名：自填
 * 考号：自填
 * 考核项目：选择框
 * 考评教师1：？选择框？
 * 考评教师2：非必填
 * 
 * 评测标准
 * 长度
 * 角度
 * 直径
 * 公差度
 * 粗糙度
 * 棱边倒角
 * 螺母规格
 * 
 * 考核零件：选择框
 */

interface IProps {
    visible: boolean,
    component?: IComponent,
    componentList?: IComponent[]
    cancel: () => void
}

const format = "HH:mm";
const SizePrecisionLevel = ['精密f', '中等m','粗糙c','最粗v']


export default function AddExamFC(props:IProps) {
    const {visible, component, componentList, cancel} = props;
    const navigate = useNavigate()
    const onCancel = ()=>{
        cancel()
    }
    const addExam =async (values: any) => {
        console.log(`提交数据： ${JSON.stringify(values)}`);
        const res = await saveExam(values);
        const {code, msg} = res.data;
        if (code !== 0){
            message.error(`新建考核失败，系统错误：${msg}`);
            return 
        }
        message.success(`新建考核成功`);
        cancel();
        navigate('/exam');
    }

  return (
    <div>
                <Modal
                    title="新建考核"
                    open={visible}
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form
                        onFinish={addExam}
                    >
                        <Form.Item
                            label="考核日期"
                            name="ExamDate"
                            rules={[{
                                required: true,
                                message: '请选择考核日期'
                            }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            label="考核时间"
                            name="StartTime"
                            required={true}
                            rules={[{
                                required: true,
                                message: '请设置考核时间'
                            }]}
                        >
                            <TimePicker
                                minuteStep={10}
                                format={format}
                            />
                        </Form.Item>
                        <Form.Item
                            label="交件时间"
                            name="FinishTime"
                            required={true}
                            rules={[{
                                required: true,
                                message: '请设置交件时间'
                            }]}
                        >
                            <TimePicker
                                minuteStep={10}
                                format={format}
                            />
                        </Form.Item>
                        <Form.Item
                            label="考核项目"
                            name="ExamTarget"
                            initialValue={"钳工"}
                        >
                            <Tag>钳工</Tag>
                        </Form.Item>
                        <Form.Item
                            label="考核零件"
                            required={true}
                            name="ExamComponent"
                            rules={[{
                                required: true,
                                message: '请选择考核零件'
                            }]}
                        >
                            <Select style={{ width: 240 }}
                            >
                                {
                                    componentList?.map((comp: IComponent, index: number) =>
                                        <Select.Option key={index} value={comp.Id}>{`${comp.Id}:${comp.ComponentName}`}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="线性尺寸公差等级"
                            required={true}
                            name="SizePrecisionLevel"
                            rules={[{
                                required: true,
                                message: '请选择公差等级'
                            }]}
                        >
                            <Select style={{ width: 240 }}
                            >
                                {
                                    SizePrecisionLevel.map((level: string, index: number) =>
                                        <Select.Option key={index} value={index}>{level}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="考核教师"
                            name="ExamTeacher"
                            required={true}
                            rules={[{
                                required: true,
                                message: '请输入考核教师'
                            }]}
                        >
                            <Input />
                        </Form.Item>

                        <Space size={'large'}>
                            <Button
                                type='primary'
                                htmlType='reset'

                            >重置</Button>
                            <Button
                                type='primary'
                                htmlType='submit'

                            >提交</Button>
                        </Space>
                    </Form>
                </Modal>
    </div>
  )
}


// export default class AddExam extends Component<IProps> {
//     state = {
//         currentCollapsePanel: 1,
//     }
//     addExam =async (values: any) => {
//         console.log(`提交数据： ${JSON.stringify(values)}`);
//         const res = await saveExam(values);
//         const {code, msg, data} = res.data;
//         if (code !== 0){
//             message.error(`新建考核失败，系统错误：${msg}`);
//             return 
//         }
//         message.success(`新建考核成功, 请到考核管理查看详情`);
//         this.props.cancel()
//     }
//     cancel = () => {
//         this.props.cancel()
//     }

//     render() {
//         return (
//             <div>
//                 <Modal
//                     title="新建考核"
//                     open={this.props.visible}
//                     onCancel={this.cancel}
//                     footer={null}
//                 >
//                     <Form
//                         onFinish={this.addExam}
//                     >
//                         <Form.Item
//                             label="考核日期"
//                             name="ExamDate"
//                             required={true}
//                             rules={[{
//                                 required: true,
//                                 message: '请选择考核日期'
//                             }]}
//                         >
//                             <Calendar fullscreen={false} />
//                         </Form.Item>
//                         <Form.Item
//                             label="考核时间"
//                             name="StartTime"
//                             required={true}
//                             rules={[{
//                                 required: true,
//                                 message: '请设置考核时间'
//                             }]}
//                         >
//                             <TimePicker
//                                 minuteStep={10}
//                                 format={format}
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="交件时间"
//                             name="FinishTime"
//                             required={true}
//                             rules={[{
//                                 required: true,
//                                 message: '请设置交件时间'
//                             }]}
//                         >
//                             <TimePicker
//                                 minuteStep={10}
//                                 format={format}
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="考核项目"
//                             name="ExamTarget"
//                             initialValue={"钳工"}
//                         >
//                             <Tag>钳工</Tag>
//                         </Form.Item>
//                         <Form.Item
//                             label="考核零件"
//                             required={true}
//                             name="ExamComponent"
//                             rules={[{
//                                 required: true,
//                                 message: '请选择考核零件'
//                             }]}
//                         >
//                             <Select style={{ width: 240 }}
//                             >
//                                 {
//                                     this.props.componentList?.map((comp: IComponent, index: number) =>
//                                         <Select.Option key={index} value={comp.Id}>{comp.ComponentName}</Select.Option>
//                                     )
//                                 }
//                             </Select>
//                         </Form.Item>
//                         <Form.Item
//                             label="线性尺寸公差等级"
//                             required={true}
//                             name="SizePrecisionLevel"
//                             rules={[{
//                                 required: true,
//                                 message: '请选择公差等级'
//                             }]}
//                         >
//                             <Select style={{ width: 240 }}
//                             >
//                                 {
//                                     SizePrecisionLevel.map((level: string, index: number) =>
//                                         <Select.Option key={index} value={index}>{level}</Select.Option>
//                                     )
//                                 }
//                             </Select>
//                         </Form.Item>
//                         <Form.Item
//                             label="考核教师"
//                             name="ExamTeacher"
//                             required={true}
//                             rules={[{
//                                 required: true,
//                                 message: '请输入考核教师'
//                             }]}
//                         >
//                             <Input />
//                         </Form.Item>

//                         <Space size={'large'}>
//                             <Button
//                                 type='primary'
//                                 htmlType='reset'

//                             >重置</Button>
//                             <Button
//                                 type='primary'
//                                 htmlType='submit'

//                             >提交</Button>
//                         </Space>
//                     </Form>
//                 </Modal>
//             </div>
//         )
//     }
// }
