import { Button, Form, Input, Modal, Space, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { createTool, deleteTool, getToolList, updateTool } from '../../api/tool';
import { IAddToolProps, IEditToolProps, ITool, IToolTableProps } from '../../interfaces/Component'

export default function ToolList() {
    const [tools, setTools] = useState<ITool[]>([]);
    const [pageSize, setPageSize] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tool, setTool] = useState<ITool>();
    const [showAddToolModal, setShowAddToolModal] = useState(false);
    const [showEditToolModal, setShowEditToolModal] = useState(false);
    const init = async (page: number = 0, limit: number = 10) => {
        setLoading(true);
        const res = await getToolList(page, limit);
        setLoading(false);
        if (!res) return;
        setTools(res.items);
        setPageSize(res.pageSize);
        setTotal(res.total);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <Button type="primary" onClick={() => setShowAddToolModal(true)}>新增工具</Button>
            <ToolTable
                tools={tools}
                pageSize={pageSize}
                total={total}
                loading={loading}
                callback={init}
                showEditToolModal={(item: ITool) => {
                    setTool(item);
                    setShowEditToolModal(true);
                }}
                pageChangeCallback={(pagenation: any) => init(pagenation.current)}
            />
            <EditTool
                open={showEditToolModal}
                tool={tool}
                callback={() => {
                    setShowEditToolModal(false);
                    init();
                }}
            />
            <AddTool
                open={showAddToolModal}
                callback={() => {
                    setShowAddToolModal(false);
                    init();
                }}
            />
        </div>
    )
}


function ToolTable(props: IToolTableProps) {
    const { tools, pageSize, total, loading, callback, showEditToolModal, pageChangeCallback } = props;

    const delTool = async (id: number) => {
        const res = await deleteTool(id);
        if (!res) return;
        callback();
    }

    const generateToolTableColumns = () => {
        const columns: TableColumnsType<ITool> = [
            { title: '工具名', key: 'Name', dataIndex: 'Name' },
            {
                title: '操作', key: 'op', render: (_: any, record: ITool) => {
                    return (<Space>
                        <Button type="primary" onClick={() => showEditToolModal(record)}>更改名称</Button>
                        <Button type="primary" danger onClick={() => delTool(record.Id)}>删除</Button>
                    </Space>)
                }
            }
        ]
        return columns;
    }

    return (<div>
        <Table
            rowKey={record => record.Id}
            columns={generateToolTableColumns()}
            dataSource={tools}
            loading={loading}
            pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
            scroll={{ y: 400 }}
            onChange={(pagenation: any) => pageChangeCallback(pagenation.current)}
        />
    </div>)
}

function EditTool(props: IEditToolProps) {
    const { tool, open, callback } = props;
    const update = async (values: any) => {
        const { Name } = values;
        const res = await updateTool(tool!.Id, Name);
        if (!res) return;
        callback();
    }

    if (!tool) return (<div></div>)
    return (
        <Modal
            title='更改工具名称'
            footer={null}
            open={open}
            onCancel={callback}
        >
            <Form
                onFinish={update}
            >
                <Form.Item
                    label='工具名'
                    name="Name"
                    rules={[{
                        required: true,
                        message: '工具名不能为空'
                    }]}
                    initialValue={tool.Name}
                >
                    <Input maxLength={20} placeholder="请输入" />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='reset'>清除</Button>
                        <Button type='primary' htmlType='submit'>保存</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>)
}

function AddTool(props: IAddToolProps) {
    const { open, callback } = props;
    const create = async (values: any) => {
        const { Name } = values;
        const res = await createTool(Name);
        if (!res) return;
        callback();
    }

    return (<div>
        <Modal
            title='新增工具'
            footer={null}
            open={open}
            onCancel={callback}
        >
            <Form
                onFinish={create}
            >
                <Form.Item>
                    <Form.Item
                        label='工具名'
                        name="Name"
                        rules={[{
                            required: true,
                            message: '工具名不能为空'
                        }]}
                    >
                        <Input maxLength={20} placeholder="请输入" />
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='reset'>清除</Button>
                        <Button type='primary' htmlType='submit'>保存</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    </div>)
}