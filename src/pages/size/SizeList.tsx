import { Button, Space, Table, Tag } from 'antd';
import React, { Component } from 'react';
import { getComponent, getComponentCount, getComponentList } from '../../api/comp';
import { getSizeList } from '../../api/size';
import { IComponent } from '../component/ComponentList';
import AddSize from './AddSize';
import DeleteSize from './DeleteSize';
import EditSize from './EditSize';

import './font.css';

export interface ISize {
    Id: number,
    ComponentId: number,
    ComponentName: string,
    FirstType: number,
    SecondType?: number,
    BaseSize?: number,
    UpSize?: number,
    BottomSize?: number,
    GeoToleranceType?: string,
    GeoToleranceVal?: string,
    SurfaceRoughnessType?: string,
    SurfaceRoughnessVal?: string,
    OtherRequirements?:string,
    Deleted: boolean
    Color: string
}
interface IState {
    sizeList: ISize[],
    componentId: number,
    loading: boolean,
    total: number,
    pageSize: number,
    current: number,
    size?: ISize,
    componentList?: IComponent[], //筛选用
    filteredComponent?: IComponent,
    showUpdateSizeModal: boolean,
    showAddSieModal:boolean
}

export default class SizeList extends Component<any, IState> {
    state = {
        sizeList: [],
        componentId: 0,
        loading: true,
        current: 1,
        pageSize: 10,
        total: 0,
        size: undefined,
        componentList: [],
        showUpdateSizeModal: false,
        showAddSieModal: false

    }
    getSizeList = async (pg: number = 1, lim: number = 10, componentId: number = 0) => {
        let cId = this.state.componentId;
        if (componentId !== 0) {
            cId = componentId
        }
        const res = await getSizeList(pg, lim, cId);
        const { data, limit, total } = res.data;
        if (this.state.componentList.length === 0) {
            const componentList = await this.getComponentListForFilter();
            this.setState({ componentList: componentList })
        }
        data.map((size:ISize)=>{
            size.Color = size?.FirstType === 0? 'blue':size?.FirstType === 1? 'red': size?.FirstType === 2?'green': 'grey';
            return size
        })
        this.setState({
            sizeList: data,
            pageSize: limit,
            total: total,
            loading: false
        })
    }

    getComponent = async (id: number = 0) => {
        if (id === 0) {
            return '';
        }
        const res = await getComponent(id);
        const componentName = res.data.ComponentName;
        return componentName
    }
    onChange = async (pagenation: any, filters?: any) => {
        let componentId = this.state.componentId
        if (filters) {
            console.log(`filter触发刷新数据:${JSON.stringify(filters)}`);
            if (filters.ComponentId) {
                componentId = filters.ComponentId[0];
                this.setState({
                    componentId: filters.ComponentId[0]
                })
            }
            if (!filters.ComponentId) {
                componentId = 0;
                this.setState({ componentId: 0 });
            }
        }
        this.getSizeList(pagenation.current, 10, componentId);
    }

    componentDidMount = () => {
        this.getSizeList();
    }

    getComponentListForFilter = async () => {
        const res1 = await getComponentCount();
        const { count } = res1.data.data;
        const res = await getComponentList(1, count);
        const { data } = res.data;
        return data;
    }
    showUpdateSizeModal = (size: ISize) => {
        console.log(`show modal, size: ${JSON.stringify(size)}`)
        this.setState({
            showUpdateSizeModal: true,
            size: size
        })
    }
    hideUpdateSizeModal = (refresh?: boolean) => {
        if (refresh) {
            this.getSizeList()
        }
        this.setState({
            showUpdateSizeModal: false
        })
    }
    showAddSizeModal = ()=>{
        this.setState({
            showAddSieModal: true
        })
    }
    hideAddSizeModal = (refresh?:boolean)=>{
        if (refresh){
            this.getSizeList()
        }
        this.setState({
            showAddSieModal: false
        })
    }
    render() {
        return (
            <div>
                <Button type='primary' onClick={this.showAddSizeModal} >添加尺寸</Button>
                <AddSize 
                visible={this.state.showAddSieModal}
                componentList={this.state.componentList}
                callback={this.hideAddSizeModal}
                />
                <EditSize
                    visible={this.state.showUpdateSizeModal}
                    size={this.state.size}
                    cancel={this.hideUpdateSizeModal}
                />
                <Table
                    loading={this.state.loading}
                    dataSource={[...this.state.sizeList]}
                    rowKey={"Id"}
                    pagination={{ position: ["bottomCenter"], total: this.state.total, pageSize: this.state.pageSize, showSizeChanger: false }}
                    onChange={this.onChange}

                >
                    <Table.Column
                        title={'零件ID'}
                        dataIndex={'ComponentId'}
                        filters={this.state.componentList.map((component: IComponent) => ({ text: component.Id, value: component.Id }))}
                        filterMultiple={false}
                    // onFilter={(value: string, record:ISize) =>String(record.ComponentId) === value}
                    // onFilter={this.showFilterdSizeList}
                    />
                    <Table.Column title={'尺寸ID'} dataIndex={'Id'} />
                    <Table.Column title="项目" key="FirstType" render={(size: ISize) => {

                        if (size.FirstType === 0) {
                            return <Tag color={size.Color}>零件尺寸检验</Tag>
                        }
                        if (size.FirstType === 1) {
                            return <Tag color={size.Color}>形位公差</Tag>
                        }
                        if (size.FirstType === 2) {
                            return <Tag color={size.Color}>表面粗糙度</Tag>
                        }
                        if (size.FirstType === 3) {
                            return <Tag color={size.Color}>其他</Tag>
                        }
                    }} />
                    <Table.Column title='类型' key='SubType' render={(record: ISize) => {
                        if (record.FirstType === 0) {
                            if (record.SecondType === 0) {
                                return (<Tag>L</Tag>)
                            }
                            if (record.SecondType && record.SecondType === 1) {
                                return (<Tag>D</Tag>)
                            }
                            if (record.SecondType && record.SecondType === 2) {
                                return (<Tag>R</Tag>)
                            }
                            if (record.SecondType && record.SecondType === 3) {
                                return (<Tag>∠</Tag>)
                            }
                        }
                        if (record.FirstType === 1) {
                            return (<Tag className='gdt'>{record.GeoToleranceType}</Tag>)
                        }
                        if (record.FirstType === 2) {
                            return (<Tag>Ra</Tag>)
                        }
                    }} />
                    <Table.Column title="基准值" key='baseValue' render={(record: ISize) => {
                        if (record.FirstType === 0) {
                            return <Tag>{record.BaseSize}</Tag>
                        }
                        if (record.FirstType === 1) {
                            return <Tag >{record.GeoToleranceVal}</Tag>
                        }
                        if (record.FirstType === 2) {
                            return <Tag >{record.SurfaceRoughnessVal}</Tag>
                        }
                    }} />
                    <Table.Column
                        title="上偏差"
                        key='upDelta'
                        render={(record: ISize) => {
                            if (record.FirstType === 0) {
                                return <Tag >{record.UpSize}</Tag>
                            }
                            if (record.FirstType === 1) {
                                return <Tag>0</Tag>
                            }
                            if (record.FirstType === 2) {
                                return (<Tag>-</Tag>)
                            }
                        }} />
                    <Table.Column
                        title="下偏差"
                        key='bottomDelta'
                        render={(record: ISize) => {
                            if (record.FirstType === 0) {
                                return <Tag>{record.BottomSize}</Tag>
                            }
                            if (record.FirstType === 1) {
                                return <Tag>{ "-" + record.GeoToleranceVal}</Tag>
                            }
                            if (record.FirstType === 2) {
                                return (<Tag>-</Tag>)
                            }
                        }} />
                    <Table.Column
                        title="上极限尺寸"
                        key='UpSize'
                        render={(record: ISize) => {
                            if (record.FirstType === 0) {
                                if (record.BaseSize && record.UpSize) {
                                    return <Tag>{Number(record.BaseSize) + Number(record.UpSize)}</Tag>
                                }
                                return <Tag>{"NaN"}</Tag>
                            }
                            if (record.FirstType === 1) {
                                return <Tag>{record.GeoToleranceVal}</Tag>
                            }
                            if (record.FirstType === 2) {
                                return (<Tag>-</Tag>)
                            }
                        }} />
                    <Table.Column
                        title="下极限尺寸"
                        key='bottomSize'
                        render={(record: ISize) => {
                            if (record.FirstType === 0) {
                                if (record.BaseSize && record.BottomSize) {
                                    return <Tag>{Number(record.BaseSize) + Number(record.BottomSize)}</Tag>
                                }
                                return <Tag>{"NaN"}</Tag>
                            }
                            if (record.FirstType === 1) {
                                return <Tag>0</Tag>
                            }
                            if (record.FirstType === 2) {
                                return (<Tag>-</Tag>)
                            }
                        }} />

                    <Table.Column title="操作" key="operation" render={(size: ISize) => (
                        <Space>
                            <Button type='primary'
                                onClick={() => { this.showUpdateSizeModal(size) }}
                            >编辑</Button>
                            <DeleteSize size={size} refresh={this.onChange} />
                        </Space>
                    )} />
                </Table>
            </div>
        )
    }
}
