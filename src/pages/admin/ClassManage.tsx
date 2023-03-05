import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { batchGetStudentInfo } from '../../api/student';
import { IStudentInfo, IStudentQueryReq } from '../../interfaces/Student';
import { StudentTable } from './StudentList';

export default function ClassManage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [students, setStudents] = useState<IStudentInfo[]>([])
    if(!location.state){
        return (<div>选中年级/专业信息丢失，请返回学生列表页重新选择操作.
            <Button type='primary' onClick={()=>navigate('/admin/student/list')}>GO</Button>
        </div>)
    }
    const grade = location.state.grade;
    const queryStudents = async (req: IStudentQueryReq) => {
        const resp = await batchGetStudentInfo(req);
        if (resp) {
          setStudents(resp);
        }
      }
    useEffect(()=>{
        queryStudents({GradeId: grade.Id})
    },[])
    return (
        <div>
            
            {/* <StudentTable
            students={students}
            callback={}
            showEditModal={(student:IStudentInfo)=>{}}
            /> */}

        </div>
    )
}
