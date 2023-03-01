import { Button, Space, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getComponentList } from '../../api/comp'
import DeleteComponentFC from './DeleteComponent'
export interface IComponent {
  Id: number,
  ComponentName: string,
  Status: number,
  Deleted: boolean,
  ClipPath: string
}

export default function ComponentList() {
  const [componentList, setComponentList] = useState<IComponent[]>();
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()
  /**
   * 分页获取零件
   * @param pg 页数 从1开始 
   * @param lim 每页数量
   */
  const getComponents = async (pg: number = 1, lim: number = 10) => {
    const res = await getComponentList(pg, lim);
    const { data, total } = res.data;
    setComponentList(data);
    setPageSize(lim);
    setTotal(total);
    setLoading(false);
  }
  /**
   * 零件列表换页处理
   * @param pagenation 
   */
  const onChange = (pagenation: any) => {
    getComponents(pagenation.current);
  }

  useEffect(() => { getComponents() }, [])


  return (
    <div>
      <Table
        loading={loading}
        dataSource={componentList}
        rowKey={'Id'}
        scroll={{ y: 400 }}
        pagination={{ position: ["bottomCenter"], total: total, pageSize: pageSize, showSizeChanger: false }}
        onChange={onChange}
      >
        <Table.Column title={'零件ID'} dataIndex={'Id'} />
        <Table.Column title={'零件名称'} dataIndex={'ComponentName'} />
        <Table.Column title={'状态'} render={(_: any, component: IComponent) => {
          if (component.Status !== 4) {
            return <Tag color='yellow'>待校正</Tag>
          } else {
            return <Tag color='green'>可用</Tag>
          }
        }} />
        <Table.Column title={'操作'} render={(component: IComponent) => (<Space>
          <Button type="primary"
            disabled={component.Status ===4}
            onClick={() => navigate(`/teacher/component/${component.Id}`)}
          >编辑</Button>
          <Button type="primary"
            disabled={component.Status !==4}
            onClick={() => navigate(`/teacher/component/${component.Id}`)}
          >查看详情</Button>
          <Button type="primary" disabled={component.Status !== 4}
            onClick={() => { navigate('/teacher/exam/create', {state: {id: component.Id}}) }}
          >新建考核</Button>
          <Button type="primary" disabled={component.Status !== 4}
          onClick={() => { navigate('/teacher/exam/demo', {state: {id: component.Id}}) }}
           >教师展示</Button>
          <DeleteComponentFC ComponentId={component.Id} onDelete={onChange} />
        </Space>

        )} />
      </Table>
      <Outlet />
    </div>
  )

}
