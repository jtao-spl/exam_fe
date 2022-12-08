import { Button, Form, Input, message, Space, Steps, Table, TableColumnsType, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getComponentById, saveComponentClip, SaveComponentName, updateComponentStatus } from '../../api/comp';
import { UploadOutlined } from '@ant-design/icons';
import { generateSizeTableColumns, ISize } from '../size/SizeList';
import { getSizeList } from '../../api/size';
import DeleteSize from '../size/DeleteSize';
import AddSizeV2 from '../size/AddSizeV2';
import EditSize from '../size/EditSize';
import ComponentDetail from './ComponentDetail';


export const getSizesByComponentId = async (id: number) => {
    const res = await getSizeList(1, 100, id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询尺寸列表失败，系统错误${msg}`);
        return
    }
    data.map((size: ISize) => {
        size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
        return size
    })
    return data;
}
export const getComponent = async (id: number) => {
    const res = await getComponentById(id);
    const { code, msg, data } = res.data;
    if (code !== 0) {
        message.error(`查询零件编辑状态失败，系统错误${msg}`);
        return
    }
    return data;
}


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

    const getSizes = async (id: number) => {
        const res = await getSizesByComponentId(id)
        setSizeList(res);
    }

    const setCurrentByComponentStatus = async (id: number) => {
        const res = await getComponent(id);
        if(res){
            setCurrent(res.Status - 1)
        }
    }

    const onDelete = async () => {
        const sizes = await getSizesByComponentId(id);
        setSizeList(sizes);
    }
    const onFinish = async () => {
        const res = await updateComponentStatus(id, 4);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`确认出错，系统错误${msg}`);
            return
        }
        message.success(`数据修正完成`);
        setTimeout(()=>navigate('/component'), 1000);
    }
    const displayUpdateSizeModal = (size: ISize) => {
        console.log(`show modal, size: ${JSON.stringify(size)}`);
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
interface IProps {
    componentId: number,
    callback: () => void
}
/**
 * 零件重命名
 * @param props 
 * @returns 
 */
function RenameComponent(props: IProps) {
    const { componentId, callback } = props;
    const saveComponent = async (values: any) => {
        if (!componentId) {
            message.error('编辑组件时组件为空');
            return;
        }
        const res = await SaveComponentName(values.ComponentName, componentId);
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`零件重命名失败，系统错误：${msg}`);
            return
        }
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
function UploadClip(props: IProps) {
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
        // console.info(`handle change info: ${JSON.stringify(info)}`);
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
        const { code, msg } = res.data;
        if (code !== 0) {
            message.error(`上传失败，系统错误：${msg}`);
            return
        }
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

interface DataType extends ISize {
    key: React.Key
}
interface IProps2 {
    sizeList?: ISize[],
    deleteCallback: () => void,
    displayUpdateSizeModal: (size: ISize) => void
}
/**
 * 尺寸列表
 * @param props 
 */
function ShowSizeList(props: IProps2) {
    const { sizeList, deleteCallback, displayUpdateSizeModal } = props;
    const onDelete = () => {
        deleteCallback()
    }
    const generateSizeTable = (sizes: any) => {
        const allColumns = generateSizeTableColumns();
        const OmitComponentIdColumns = allColumns.filter((item: any) => item.key !== 'ComponentId')
        const columns: TableColumnsType<DataType> = [
            ...OmitComponentIdColumns,
            {
                title: "操作", key: "operation", render: (_: any, size: ISize) => (
                    <Space>
                        <Button type='primary'
                            onClick={() => displayUpdateSizeModal(size)}
                        >编辑</Button>
                        <DeleteSize size={size} refresh={onDelete} />
                    </Space>
                )
            }
        ];
        sizes.sort((a: ISize, b: ISize) => { return a.FirstType - b.FirstType })
        return <Table
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