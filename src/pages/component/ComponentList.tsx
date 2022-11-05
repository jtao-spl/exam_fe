import { Button, Space, Table } from 'antd'
import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import { getComponentCount, getComponentList } from '../../api/comp'
import { getSizeCountByComponentId, getSizeList } from '../../api/size'
import AddExamFC from '../exam/AddExam'
import { ISize } from '../size/SizeList'
import DeleteComponentFC from './DeleteComponent'
import  EditComponentFC from './EditComponent'
import ShowSizeListFC from './ShowSizeList'
export interface IComponent {
  Id: number,
  ComponentName: string,
  Status: boolean,
  Deleted: boolean,
  ClipPath: string
}
interface IState {
  componentList: IComponent[],
  allComponentList?: IComponent[],
  sizeList?: ISize[],
  current: number,
  pageSize: number,
  total: number,
  loading: boolean,
  showEditComponentModal: boolean,
  component?: IComponent
  showUploadEntry: boolean
  showSizeListModal: boolean
  showAddExamModal: boolean
}
export default class ComponentList extends Component<any, IState> {
  state = {
    componentList: [],
    allComponentList:[],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: true,
    showEditComponentModal: false,
    component: undefined,
    sizeList: [],
    showUploadEntry: true,
    showSizeListModal: false,
    showAddExamModal: false
  }

  getComponentList = async (pg: number = 1, lim: number = 10) => {
    const res = await getComponentList(pg, lim);
    const { data, total } = res.data;
    this.setState({
      componentList: data,
      pageSize: lim,
      total: total,
      loading: false
    });
  }

  onChange = (pagenation: any) => {
    this.getComponentList(pagenation.current);
  }
  showEditComponentModal = (component?: IComponent) => {
    this.setState({
      showEditComponentModal: true,
      component: component,
      showUploadEntry: component?.ClipPath === "" ? true : false
    })
  }
  hideEditComponentModal = (refresh?: boolean) => {
    if (refresh) {
      this.getComponentList();
    }
    this.setState({
      showEditComponentModal: false
    })
  }
  showSizeListModal = async (component: IComponent) => {
    const res = await getSizeCountByComponentId(component.Id);
    const { count } = res.data.data;
    const res1 = await getSizeList(1, count, component.Id);
    const { data } = res1.data;
    data.map((size: ISize) => {
      size.Color = size?.FirstType === 0 ? 'blue' : size?.FirstType === 1 ? 'red' : size?.FirstType === 2 ? 'green' : 'grey';
      return size
    })
    this.setState({
      showSizeListModal: true,
      sizeList: data
    })
  }
  hideShowSizeListModal = () => {
    this.setState({
      showSizeListModal: false
    })
  }
  showAddExamModal = async (component:IComponent) => {
    const res = await getComponentCount();
    const {count} = res.data.data;
    const res_all = await getComponentList(1, count);
    let {code, data} = res_all.data; 
    if(code !==0){
        data = []
    }
    this.setState({
      component: component,
      allComponentList: data,
      showAddExamModal: true
    })
  }
  hideAddExamModal = () => {
    this.setState({
      showAddExamModal: false
    })
  }


  componentDidMount() {
    this.getComponentList();
  }

  render() {
    return (
      <div>
        <EditComponentFC
          component={this.state.component}
          visible={this.state.showEditComponentModal}
          cancel={this.hideEditComponentModal}
          canUpload={this.state.showUploadEntry}
        />
        <ShowSizeListFC
          visible={this.state.showSizeListModal}
          cancel={this.hideShowSizeListModal}
          sizeList={this.state.sizeList}
        />
        <AddExamFC
          visible={this.state.showAddExamModal}
          component={this.state.component}
          componentList={this.state.allComponentList}
          cancel={this.hideAddExamModal}

        />
        <Table
          loading={this.state.loading}
          dataSource={this.state.componentList}
          rowKey={'Id'}
          pagination={{ position: ["bottomCenter"], total: this.state.total, pageSize: this.state.pageSize, showSizeChanger: false }}
          onChange={this.onChange}
        >
          <Table.Column title={'零件ID'} dataIndex={'Id'} />
          <Table.Column title={'零件名称'} dataIndex={'ComponentName'} />
          <Table.Column title={'创建时间'} dataIndex={'createdAt'} />
          <Table.Column title={'修改时间'} dataIndex={'updatedAt'} />
          <Table.Column title={'操作'} render={(component: IComponent) => (<Space>
            <Button type="primary"
              onClick={() => { this.showEditComponentModal(component) }}
            >编辑</Button>
            <Button type="primary"
              onClick={() => { this.showSizeListModal(component) }}
            >查看尺寸</Button>
            <Button type="primary"
              onClick={()=>{this.showAddExamModal(component)}}
            >新建考核</Button>
            <DeleteComponentFC ComponentId={component.Id} onDelete={this.onChange} />
          </Space>

          )} />
        </Table>
        <Outlet />
      </div>
    )
  }
}

