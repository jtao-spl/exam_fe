import { Button, Form, Input, message, Radio, Space, Steps, Table, Divider, TableColumnsType, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getComponentById, saveComponentClip, SaveComponentName, updateComponentStatus } from '../../api/comp';
import { UploadOutlined } from '@ant-design/icons';

import DeleteSize from '../size/DeleteSize';
import AddSizeV2 from '../size/AddSizeV2';
import EditSize from '../size/EditSize';
import ComponentDetail from './ComponentDetail';
import { IDiameterType, IShowSizeListProps, ISize } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { IComponent, IDiameterConfigProps, IEditComponentProps } from '../../interfaces/Component';
import { generateSizeTableColumns } from '../../wrapper/Size';
import { updateDiameterType } from '../../api/size';


export default function EditComponentV2() {
    const params = useParams();
    // const navigate = useNavigate();

    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id);
    }
    const [current, setCurrent] = useState(0);
    const [sizeList, setSizeList] = useState<ISize[]>([]);
    // const [component, setComponent] = useState<IComponent>();
    const [showUpdateSizeModal, setShowUpdateSizeModal] = useState(false);
    const [showAddSieModal, setShowAddSieModal] = useState(false);
    const [size, setSize] = useState<ISize>();

    /**
     * 获取尺寸列表
     * @param id 组件id
     * @returns 
     */
    const getSizes = async (id: number) => {
        const res = await getSizesByComponentId(id)
        setSizeList(res);
        return res
    }

    // const refreshComponent = async () => {
    //     const component = await getComponentById(id);
    //     setComponent(component);

    // }
    /**
     * 通过组件的状态确定当前在编辑组件的哪一步
     * @param id 
     */
    const setCurrentByComponentStatus = async (id: number) => {
        const res = await getComponentById(id);
        if (res) {
            setCurrent(res.Status - 1)
        }
    }

    const onDelete = async () => {
        const sizes = await getSizesByComponentId(id);
        setSizeList(sizes);
    }
    // const onFinish = async () => {
    //     const res = await updateComponentStatus(id, 4);
    //     if (!res) return;
    //     setTimeout(() => navigate('/teacher/component/list'), 1000);
    // }

    const displayUpdateSizeModal = (size: ISize) => {
        setShowUpdateSizeModal(true);
        setSize(size);
    }

    const hideUpdateSizeModal = (refresh?: boolean) => {
        if (refresh) {
            getSizes(id);
        }
        setShowUpdateSizeModal(false);
    }
    const displayShowAddSizeModal = () => {
        setShowAddSieModal(true);
    }
    const hideAddSizeModal = (refresh?: boolean) => {
        if (refresh) {
            getSizes(id);
        }
        setShowAddSieModal(false);
    }

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    useEffect(() => {
        getSizes(id);
        setCurrentByComponentStatus(id)
    }, []);
    // useEffect(() => {
    //     refreshComponent();
    // }, [current])
    const steps = [
        {
            title: '零件重命名',
            component: <RenameComponent componentId={id} callback={next} />

        },
        {
            title: '上传零件图样',
            component: <UploadClip componentId={id} callback={next} />
        },
        {
            title: '尺寸校准',
            component: (<div>
                <Button type='primary' onClick={displayShowAddSizeModal} >添加尺寸</Button>
                <AddSizeV2
                    visible={showAddSieModal}
                    componentId={id}
                    callback={hideAddSizeModal}
                />
                <EditSize
                    visible={showUpdateSizeModal}
                    size={size}
                    cancel={hideUpdateSizeModal}
                />
                <ShowSizeList
                    id={id}
                    sizeList={sizeList}
                    deleteCallback={onDelete}
                    displayUpdateSizeModal={displayUpdateSizeModal}
                    callback={next}
                />
            </div>)
        },
        {
            title: '直径配置',
            component: <DiameterConfig
                id={id}
                refreshSizeCallback={() => getSizes(id)}
                sizes={sizeList}
                callback={() => { }}
            />
        }
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    console.log(`current: ${current}`)
    return (

        <>
            {current >= steps.length && <ComponentDetail />}
            {current < steps.length && <>
                < Steps current={current} items={items} />
                <Divider />
                <div className="steps-content">{steps[current].component}</div>
                <Divider />
                <div className="steps-action">
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            上一步
                        </Button>
                    )}
                    {/* {current < steps.length - 1 && (
                        <Button type="primary" disabled={component ? current < component.Status : false} onClick={() => next()}>
                            下一步
                        </Button>
                    )} */}
                    {/* {current === steps.length - 1 && (
                        <Button type="primary" onClick={onFinish}>
                            完成
                        </Button>
                    )} */}

                </div>
            </>
            }
        </>
    );
}
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


/**
 * 零件重命名
 * @param props 
 * @returns 
 */
function RenameComponent(props: IEditComponentProps) {
    const { componentId, callback } = props;
    const saveComponent = async (values: any) => {
        if (!componentId) {
            message.error('编辑组件时组件为空');
            return;
        }
        const res = await SaveComponentName(values.ComponentName, componentId);
        if (!res) return;
        callback()
    }
    return (<Form
        onFinish={saveComponent}
    >
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
    </Form>)
}

/**
 * 上传零件图样
 * @param props 
 * @returns 
 */
function UploadClip(props: IEditComponentProps) {
    const { componentId, callback } = props;
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
        if (info.file.status === 'done') {
            message.success('上传成功');

        }
        if (info.file.status === 'error') {
            message.error('上传失败');
        }
    }

    const customRequest = async (option: any) => {
        if (!componentId) {
            message.error('编辑零件时零件为空');
            return;
        }
        const res = await saveComponentClip(option.file, componentId)
        if (!res) return;
        option.onSuccess();
        callback()
    }

    return (<Form>
        <Form.Item>
            {<Space>上传零件所对应的示意图</Space>}
        </Form.Item>
        <Form.Item>
            {<Upload
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
    </Form>)
}

/**
 * 尺寸列表
 * @param props 
 */
function ShowSizeList(props: IShowSizeListProps) {
    const { id, sizeList, deleteCallback, displayUpdateSizeModal, callback } = props;
    const onDelete = () => {
        deleteCallback()
    }

    const onConfirm = async () => {
        const res = await updateComponentStatus(id, 4);
        if (res) callback()
    }

    const generateSizeTable = (sizes: any) => {
        const allColumns = generateSizeTableColumns();
        const OmitComponentIdColumns = allColumns.filter((item: any) => item.key !== 'ComponentId')
        const columns: TableColumnsType<ISize> = [
            ...OmitComponentIdColumns,
            {
                title: "操作", key: "operation", render: (_: any, size: ISize) => (
                    <Space>
                        <Button type='primary'
                            onClick={() => displayUpdateSizeModal(size)}
                        >编辑</Button>
                        <DeleteSize size={size} refresh={onDelete} isAggSizeDeletable={true} />
                    </Space>
                )
            }
        ];
        return (<Table
            rowKey={record => record.Id}
            dataSource={sizes}
            columns={columns}
            pagination={false}
            scroll={{ y: 400 }}
        />)
    }

    return (
        <div>
            {sizeList && generateSizeTable(sizeList)}
            <Button type="primary" onClick={onConfirm}>确认校验完成</Button>
        </div>
    )
}

/**
 * 指定内外半径
 * @param props 
 * @returns 
 */
function DiameterConfig(props: IDiameterConfigProps) {
    const navigate = useNavigate();
    const { id, sizes, callback } = props;
    const [form] = Form.useForm();
    const [diameters, setDiameters] = useState<ISize[]>([]);

    const init = () => {
        const diameters = sizes.filter((size: ISize) => size.FirstType === 0 && size.SecondType && size.SecondType === 1);
        setDiameters(diameters);
        form.setFieldsValue({
            "diameters": diameters
        });
    }

    useEffect(() => {
        init()
    }, [])
    const setDiamterConfig = async (values: any) => {
        console.log(`存储内外经：${JSON.stringify(values)}`);
        const sizes = values.diameters;
        const request: IDiameterType[] = sizes.map((size: any) => ({ id: size.Id, type: size.type }));
        const res = await updateDiameterType(request);
        if (!res) return;
        const res2 = await updateComponentStatus(id, 5);
        if (!res2) return;
        setTimeout(() => navigate('/teacher/component/list'), 1000);
    }
    if (diameters.length === 0) {
        return (<Space direction='vertical'>
            <div>未检测到直径尺寸，请返回上一步再次确认。</div>
            <Button type='primary' onClick={callback}>完成</Button>
        </Space>)
    }
    return (<div>
        <Form form={form} name="dynamic_form_nest_item" onFinish={setDiamterConfig} autoComplete="off"
        >
            <Form.List name="diameters" >
                {(fields) => (
                    <React.Fragment>
                        {fields.map(({ key, name, ...restField }) =>
                        (<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            尺寸id: <Tag>{diameters.at(key)?.Id}</Tag>
                            基准值: <Tag>{diameters.at(key)?.BaseSize}</Tag>
                            上偏差: <Tag>{diameters.at(key)?.UpSize}</Tag>
                            下偏差: <Tag>{diameters.at(key)?.BottomSize}</Tag>
                            类型:
                            <Form.Item
                                {...restField}
                                name={[name, 'type']}
                                rules={[{ required: true, message: '请选择' }]}
                            >
                                <Radio.Group value={1}>
                                    <Radio value={1}>内径</Radio>
                                    <Radio value={2}>外径</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Space>)
                        )}
                    </React.Fragment>
                )
                }
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">保存并完成</Button>
            </Form.Item>
        </Form>
    </div>)
}