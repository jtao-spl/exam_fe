import React from 'react';
import { Button, Result } from 'antd';
import { get } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

export default function Page404() {
  const navigate = useNavigate()
  console.log(`role: ${get('role')}`)
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => {
        if (get('role') === '2') {
          navigate('/teacher/component/list')
        }
        else if (get('role') === '1') {
          navigate('/admin/teacher/list')
        }
        else {
          navigate('/student/exams')
        }
      }}>返回主页</Button>}
    />
  )
}
