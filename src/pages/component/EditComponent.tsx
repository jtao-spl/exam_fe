import React, { Component } from 'react';
import { Button, Form, Input, message, Modal, Space, Upload } from 'antd';
import { IComponent } from './ComponentList';
import { UploadOutlined } from '@ant-design/icons';
import { saveComponentClip, SaveComponentName } from '../../api/comp';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

interface IProps {
    component?: IComponent
    visible: boolean
    cancel: (refresh?: boolean) => void
    canUpload: boolean
}

export default function EditComponentFC(props:IProps) {
    const {component, visible, cancel,canUpload} = props;
    const saveComponent = async (values: any) => {
        if (!component) {
            message.error('编辑组件时组件为空');
            return;
        }
        const res = await SaveComponentName(values.ComponentName, component.Id);
        // console.log(`保存表格回调values: ${JSON.stringify(values)}`);
        cancel(true)
    }

    const beforeUpload = (file: any) => {
        const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!allowFormat) {
            message.error('请上传JPG/PNG格式的零件示意截图');
        }
        const fileSize = file.size / 1024 / 1024 < 5;
        if (!fileSize) {
            message.error('请上传不大于5M的零件示意截图');
        }
        return allowFormat && fileSize;
    }

    const handleChange = (info: any) => {
        // console.info(`handle change info: ${JSON.stringify(info)}`);
        if (info.file.status === 'done') {
            message.success('上传成功');
            cancel(true);
            return;
        }
        if (info.file.status === 'error') {
            message.error('上传失败');
        }
    }

    const customRequest = async (option: any) => {
        if (!component) {
            console.error('编辑零件时零件为空');
            return;
        }
        const res = await saveComponentClip(option.file, component.Id)
        option.onSuccess();
    }

    return (
        <div>
            <Modal
                title="编辑零件"
                open={visible}
                footer={null}
                onCancel={()=>cancel()}>
                <Form
                    onFinish={saveComponent}
                >
                    <Form.Item>
                        1. 修改零件名称以更好地识别
                    </Form.Item>
                    <Form.Item
                        name='ComponentName'
                        shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: '零件名称不可以为空'
                            }
                        ]}
                        label='零件名称'>
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            保存名称
                        </Button>
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Item>
                        {canUpload && <Space>2. 上传零件所对应的示意图</Space>}
                    </Form.Item>
                    <Form.Item>
                        {canUpload && <Upload
                            accept='.jpg,.png'
                            headers={{ 'content-type': 'multipart/form-data' }}
                            maxCount={1}
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={customRequest}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>上传零件示意图</Button>
                        </Upload>
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}



// export default class EditComponent extends Component<IProps> {
//     cancel = () => {
//         this.props.cancel()
//     }
//     saveComponent = async (values: any) => {
//         if (!this.props.component) {
//             message.error('编辑组件时组件为空');
//             return;
//         }
//         const res = await SaveComponentName(values.ComponentName, this.props.component.Id);
//         // console.log(`保存表格回调values: ${JSON.stringify(values)}`);
//         this.props.cancel(true)
//     }

//     beforeUpload = (file: any) => {
//         console.info(`handle beforeUpload  file:${JSON.stringify(file)}`);
//         const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';
//         if (!allowFormat) {
//             alert('请上传JPG/PNG格式的零件示意截图');
//         }
//         const fileSize = file.size / 1024 / 1024 < 5;
//         if (!fileSize) {
//             alert('请上传不大于5M的零件示意截图');
//         }
//         return allowFormat && fileSize;
//     }

//     handleChange = (info: any) => {
//         // console.info(`handle change info: ${JSON.stringify(info)}`);
//         if (info.file.status === 'done') {
//             message.success('上传成功');
//         }
//         if (info.file.status === 'error') {
//             message.error('上传失败');
//         }
//     }

//     customRequest = async (option: any) => {
//         if (!this.props.component) {
//             console.error('编辑零件时零件为空');
//             return;
//         }
//         const res = await saveComponentClip(option.file, this.props.component.Id)
//         option.onSuccess();
//     }
//     render() {
//         return (
//             <div>
//                 <Modal
//                     title="编辑零件"
//                     open={this.props.visible}
//                     footer={null}
//                     onCancel={this.cancel}>
//                     <Form
//                         onFinish={this.saveComponent}
//                     >
//                         <Form.Item>
//                             1. 修改零件名称以更好地识别
//                         </Form.Item>
//                         <Form.Item
//                             name='ComponentName'
//                             shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
//                             rules={[
//                                 {
//                                     type: 'string',
//                                     required: true,
//                                     message: '零件名称不可以为空'
//                                 }
//                             ]}
//                             label='零件名称'>
//                             <Input />
//                         </Form.Item>

//                         <Form.Item {...tailLayout}>
//                             <Button type="primary" htmlType="submit">
//                                 保存名称
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                     <Form>
//                         <Form.Item>
//                             {this.props.canUpload && <Space>2. 上传零件所对应的示意图</Space>}
//                         </Form.Item>
//                         <Form.Item>
//                             {this.props.canUpload && <Upload

//                                 accept='.jpg,.png'
//                                 headers={{ 'content-type': 'multipart/form-data' }}
//                                 maxCount={1}
//                                 showUploadList={false}
//                                 beforeUpload={this.beforeUpload}
//                                 onChange={this.handleChange}
//                                 customRequest={this.customRequest}
//                                 listType="picture"
//                             >
//                                 <Button icon={<UploadOutlined />}>上传零件示意图</Button>
//                             </Upload>
//                             }
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//             </div>
//         )
//     }
// }



