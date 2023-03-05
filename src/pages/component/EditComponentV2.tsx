import { Button, Form, Input, message, Space, Steps, Table, TableColumnsType, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getComponentById, saveComponentClip, SaveComponentName, updateComponentStatus } from '../../api/comp';
import { UploadOutlined } from '@ant-design/icons';

import DeleteSize from '../size/DeleteSize';
import AddSizeV2 from '../size/AddSizeV2';
import EditSize from '../size/EditSize';
import ComponentDetail from './ComponentDetail';
import { IShowSizeListProps, ISize } from '../../interfaces/Size';
import { getSizesByComponentId } from '../../wrapper/Component';
import { IEditComponentProps } from '../../interfaces/Component';
import { generateSizeTableColumns } from '../../wrapper/Size';


export default function EditComponentV2() {
    const params = useParams();
    const navigate = useNavigate();

    let id = 0;
    if (params.id) {
        id = Number.parseInt(params.id);
    }
    const [current, setCurrent] = useState(0);
    const [sizeList, setSizeList] = useState<ISize[]>();
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
    const onFinish = async () => {
        const res = await updateComponentStatus(id, 4);
        if(!res) return;
        setTimeout(() => navigate('/teacher/component/list'), 1000);
    }

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
        setCurrentByComponentStatus(id)
        getSizes(id);

    }, [])
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
                    sizeList={sizeList}
                    deleteCallback={onDelete}
                    displayUpdateSizeModal={displayUpdateSizeModal}
                />
            </div>)
        }
    ]
    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    console.log(`current: ${current}`)
    return (

        <>
            {current >= steps.length && <ComponentDetail />}
            {current < steps.length && <>
                < Steps current={current} items={items} />
                <div className="steps-content">{steps[current].component}</div>
                <div className="steps-action">
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            上一步
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={onFinish}>
                            完成
                        </Button>
                    )}

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
        if(!res) return;
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
        if(!res) return;
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
    const { sizeList, deleteCallback, displayUpdateSizeModal } = props;
    const onDelete = () => {
        deleteCallback()
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
                        <DeleteSize size={size} refresh={onDelete} isAggSizeDeletable={true}/>
                    </Space>
                )
            }
        ];
        return <Table
            rowKey={record=>record.Id}
            dataSource={sizes}
            columns={columns}
            pagination={false}
            scroll={{ y: 400 }}
        />
    }

    return (
        <div>
            {sizeList && generateSizeTable(sizeList)}
        </div>
    )
}
