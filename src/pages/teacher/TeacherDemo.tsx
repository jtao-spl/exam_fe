import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function TeacherDemo() {
    const navigate = useNavigate();
    const location = useLocation();
    const examId = location.state.id;


    useEffect(()=>{
        //第一步获取考核关联的组件元素信息，然后组装表格，待填项赋默认值，输入时动态刷新
        //TODO: 需要在前置的零件设置的时候，针对直径数据，要求必填是内径还是外径
        //新增测量工具的编排选择能力
        //新增展示时的入库 报废 返工 未知 评测标准
    },[])
    return (
        <div>TeacherDemo</div>
    )
}
