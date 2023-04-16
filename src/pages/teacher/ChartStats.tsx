import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Button, Select, Space, Table, TableColumnsType } from 'antd';
import { IDeliverDistribution, IDeliverSizeStat, IDeliverStat, IExamDeliver } from '../../interfaces/Exam';
import { downloadScoreDetail, getDetailedScoresByDeliverId, getExamDeliverList, getExamDistributionByDeliverId, getExamStatsByDeliverId } from '../../api/exam';
import { useLocation } from 'react-router-dom';

export default function ChartStats() {
    const [delivers, setDelivers] = useState<IExamDeliver[]>([]);

    const [deliverId, setDeliverId] = useState(0);
    const [generalStat, setGeneralStat] = useState<IDeliverStat>();
    const [examDistribution, setExamDistribution] = useState<IDeliverDistribution>();
    const [sizeStats, setSizeStats] = useState<IDeliverSizeStat[]>([]);
    let location = useLocation();

    const init = async (pg: number, limit: number) => {
        const res = await getExamDeliverList(pg, limit, true);
        if (!res || res.items.length === 0) return;
        setDelivers(res.items);
    }


    const getStats = async (id: number) => {
        if (!id) return;
        const res = await getExamStatsByDeliverId(id);
        if (!res) return;
        setGeneralStat(res);
        const dist = await getExamDistributionByDeliverId(id);
        if (!dist) return;
        setExamDistribution(dist);
        const sizeStats = await getDetailedScoresByDeliverId(id);
        setSizeStats(sizeStats);

    }

    useEffect(() => {
        init(1, 10);
        if (location.state) {
            setDeliverId(location.state)
        }

    }, [])

    useEffect(() => {
        getStats(deliverId)
    }, [deliverId])

    return (<div>

        <div>请选择：
            <Select style={{ width: 240 }}
                allowClear={true}
                onChange={(value: number) => setDeliverId(value)}
                defaultValue={location.state}
            >
                {
                    delivers.map((deliver: IExamDeliver) =>
                        <Select.Option key={deliver.Id} value={deliver.Id}>{deliver.ExamName}</Select.Option>
                    )
                }
            </Select>
        </div>
        <Button
            type='primary'
            onClick={async () => await downloadScoreDetail(deliverId)}
            disabled={deliverId === 0}
            >下载班级成绩统计</Button>
        <GeneralStats Stats={generalStat} />
        <ScoreLeveledStats data={examDistribution} />
        <DetailSizeScore data={sizeStats} />

    </div>);
}


function GeneralStats(props: { Stats?: IDeliverStat }) {
    const { Stats } = props;

    const getGeneralStatsColumns = () => {
        const columns: TableColumnsType<IDeliverStat> = [
            {
                title: `考核统计`, key: 'header', children: [
                    {
                        title: `参考人数`, key: `PartCnt`, dataIndex: 'PartCnt',
                    },
                    {
                        title: `平均分`, key: `AvgScore`, render: (_: any, record: IDeliverStat) => {
                            return record.AvgScore / 100
                        }
                    },
                    {
                        title: `及格率`, key: `PassRate`, render: (_: any, record: IDeliverStat) => {
                            return `${record.PassRate}%`
                        }
                    },
                    {
                        title: `优秀率`, key: `ExclRate`, render: (_: any, record: IDeliverStat) => {
                            return `${record.ExclRate}%`
                        }
                    },
                    {
                        title: `低分率`, key: `LowRate`, render: (_: any, record: IDeliverStat) => {
                            return `${record.LowRate}%`
                        }
                    },
                    {
                        title: `标准差`, key: `StandardDiff`, dataIndex: `StandardDiff`,
                    },
                ]
            }
        ];
        return columns;
    }
    return <Table
        columns={getGeneralStatsColumns()}
        dataSource={Stats ? [Stats] : []}
        pagination={false}
        bordered={true}
        rowKey={record => record.Id}
    />
}

function ScoreLeveledStats(props: { data?: IDeliverDistribution }) {
    const { data } = props;
    let counts: number[] = [];
    let fieldCount: { key: string, value: number }[] = [];
    if (data) {
        counts = [data.ScoreLe30, data.Score3040, data.Score4050,
        data.Score5060, data.Score6070, data.Score7080,
        data.Score8090, data.Score90100]
        fieldCount.push(...[
            { key: '0-30', value: data.ScoreLe30 },
            { key: '30-40', value: data.Score3040 },
            { key: '40-50', value: data.Score4050 },
            { key: '50-60', value: data.Score5060 },
            { key: '60-70', value: data.Score6070 },
            { key: '70-80', value: data.Score7080 },
            { key: '80-90', value: data.Score8090 },
            { key: '90-100', value: data.Score90100 },
        ])
    }

    const option = {
        title: {
            text: '各分数段人数',
            fontWeight: 'nromal',
            fontSize: 12,
            textAlign: "auto",
        },
        grid: {
            left: "5%",
            right: "5%",
            bottom: "5%",
            top: "10%",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "none",
            },
            formatter: function (params: any) {
                return (
                    params[0].name +
                    "<br/>" +
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                    params[0].seriesName +
                    " : " + params[0].value
                    +
                    " <br/>"
                );
            },
        },
        backgroundColor: "rgb(255,255,255)",
        xAxis: {
            show: true,
            type: "value",
        },
        yAxis: [
            {
                type: "category",
                inverse: true,
                axisLabel: {
                    show: true,

                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: true,
                },
                axisLine: {
                    show: true,
                },
                data: ["0-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"],
            },
            {
                type: "category",
                inverse: true,
                axisTick: "none",
                axisLine: "none",
                show: true,
                axisLabel: {
                    fontSize: "12",
                },
                data: counts,
            },
        ],
        series: [
            {
                name: "人数",
                type: "bar",
                zlevel: 1,
                itemStyle: {

                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
                        [
                            {
                                offset: 0,
                                color: 'rgba(255,128,0, 0.5)',
                            },
                            {
                                offset: 0.98,
                                color: '#FF8800',
                            },
                        ],
                        false,
                    ),
                    borderRadius: 30,

                },
                barWidth: 10,
                data: counts,
            },
        ],
    };
    const getScoreLeveledStatsColumns = () => {
        const columns: TableColumnsType<{ key: string, value: number }> = [
            {
                title: `各分数段人数`, key: `sum`, children: [
                    {
                        title: `分数段`, key: `scoreScope`, dataIndex: "key",
                    },
                    {
                        title: `人数`, key: `count`, dataIndex: "value",
                    }
                ]
            }
        ];
        return columns;
    }

    return (
        <div>
            <Table
                columns={getScoreLeveledStatsColumns()}
                dataSource={fieldCount}
                pagination={false}
                bordered={true}
                rowKey={record => record.key}
            />
            <ReactEcharts
                option={option}
                notMerge
                lazyUpdate />
        </div>
    )
}

function DetailSizeScore(props: { data: IDeliverSizeStat[] }) {
    const { data } = props;
    const yData = data.map((item: IDeliverSizeStat, index: number) => item.IsSecurity ? `安全文明${index + 1}` : `评分项${index + 1}`);
    const xData = data.map((item: IDeliverSizeStat) => item.ScoreRate);
    const getDetailItemScoreColumns = () => {
        const columns: TableColumnsType<IDeliverSizeStat> = [
            {
                title: `各评分项得分情况`, key: `stat`, children: [
                    {
                        title: `序号`, key: `index`, dataIndex: `index`, render: (_: any, __: any, index: number) => {
                            return index + 1
                        }
                    },
                    {
                        title: `评分项`, key: `item`, render: (_: any, record: IDeliverSizeStat, index: number) => {
                            if (record.IsSecurity) return `安全文明${index + 1}`;
                            return `评分项${index + 1}`
                        }
                    },
                    {
                        title: `分值设置`, key: `total`, dataIndex: `Total`,
                    },
                    {
                        title: `平均分`, key: `avg`, render: (_: any, record: IDeliverSizeStat) => {
                            return record.ScoreAvg / 100
                        }
                    },
                    {
                        title: `得分率`, key: `scoreRate`, render: (_: any, record: IDeliverSizeStat) => {
                            return `${record.ScoreRate}%`
                        }
                    },
                ]
            }
        ];
        return columns;
    }
    const option = {
        title: {
            text: '考核项目得分率',
            fontWeight: 'nromal',
            fontSize: 12,
            textAlign: "auto",
        },
        grid: {
            left: "5%",
            right: "5%",
            bottom: "5%",
            top: "10%",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "none",
            },
            formatter: function (params: any) {
                return (
                    params[0].name +
                    "<br/>" +
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                    params[0].seriesName +
                    " : " +
                    params[0].value + "%<br/>"
                );
            },
        },
        backgroundColor: "rgb(255,255,255)",
        xAxis: {
            show: false,
            type: "value",
            axisLable: {
                formatter: function (value: any) {
                    return value / 100 + "%"
                }
            }
        },
        yAxis: [
            {
                type: "category",
                inverse: true,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: true,
                },
                axisLine: {
                    show: true,
                },
                data: yData,
            },
            {
                type: "category",
                inverse: true,
                axisTick: "none",
                axisLine: "none",
                show: true,
                axisLabel: {
                    color: "#ffffff",
                    fontSize: "12",
                },
                data: [],
            },
        ],
        series: [
            {
                name: "得分率",
                type: "bar",
                zlevel: 1,
                itemStyle: {

                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
                        [
                            {
                                offset: 0,
                                color: '#FF8800',
                            },
                            {
                                offset: 0.98,
                                color: '#FF8800',
                            },
                        ],
                        false,
                    ),
                    borderRadius: 30,

                },
                barWidth: 10,
                data: xData,
            },
        ],
    };

    return (<div><Table
        columns={getDetailItemScoreColumns()}
        dataSource={data}
        pagination={false}
        bordered={true}
        rowKey={record => record.Id}
    />
        <ReactEcharts
            option={option}
            notMerge
            lazyUpdate />
    </div>)
}