import React, { lazy, ReactNode } from 'react';
import { HomeOutlined, LoginOutlined, PartitionOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ChangePassword = lazy(() => import('../pages/auth/ChangePassword'))
const Login = lazy(() => import('../pages/Login'));
const ComponentList = lazy(() => import('../pages/component/ComponentList'));
const SizeList = lazy(() => import('../pages/size/SizeList'));
const Page404 = lazy(() => import('../pages/Page404'));
const ExamList = lazy(() => import('../pages/exam/ExamList'));
const Exams = lazy(() => import('../pages/student/Exams'));
const TeacherList = lazy(() => import('../pages/admin/TeacherList'));
const StudentList = lazy(() => import('../pages/admin/StudentList'));
const ToolList = lazy(() => import('../pages/teacher/ToolList'));
const TeacherStuList = lazy(()=>import('../pages/teacher/StudentList'));
export interface IRouter {
    title: React.ReactNode,
    path: string,
    key: string,
    icon: React.ReactNode,
    element?: ReactNode,
    children?: IRouter[]
}

export const teacherRouters: IRouter[] = [

    {
        title: '零件管理',
        path: '/teacher/component',
        key: 'component',
        icon: <PartitionOutlined />,
        children: [
            {
                title: <Link to='/teacher/component/list'>零件列表</Link>,
                // title: 'etst',
                path: '/teacher/component/list',
                key: 'management',
                icon: <PartitionOutlined />,
                element: <ComponentList />
            },
            {
                title: <Link to='/teacher/component/tools'>工具列表</Link>,
                // title: 'etst',
                path: '/teacher/component/tools',
                key: 'tools',
                icon: <PartitionOutlined />,
                element: <ToolList />
            },
        ]
    },
    {
        title: '学生管理',
        path: '/teacher/student',
        key: 'student',
        icon: <InfoCircleOutlined />,
        children: [
            {
                title: <Link to='/teacher/student/list'>分组管理</Link>,
                path: '/teacher/student/list',
                key: 'students',
                icon: <PartitionOutlined />,
                element: <TeacherStuList />
            }
        ]
    },

    {
        title: '考试管理',
        path: '/teacher/exam',
        key: 'exam',
        icon: <InfoCircleOutlined />,
        children: [
            {
                title: <Link to='/teacher/exam/list'>考卷列表</Link>,
                path: '/teacher/exam/list',
                key: 'exams',
                icon: <PartitionOutlined />,
                element: <ExamList />
            }
        ]
    },
    {
        title: <Link to='/auth/modify'>修改密码</Link>,
        path: '/auth/modify',
        key: 'auth',
        icon: <InfoCircleOutlined />,
        element: <ChangePassword />
    }


]
const routers: IRouter[] = [
    // {
    //     title: <Link to='/' >主页</Link>,
    //     path:'/',
    //     key: 'homepage',
    //     icon: <HomeOutlined />,
    //     element: <Dashboard />,
    // },
    {
        title: "主页",
        path: '/',
        key: 'index',
        icon: <HomeOutlined />
    },
    {
        title: <Link to='/component'>零件列表</Link>,
        path: 'component',
        key: 'component',
        icon: <PartitionOutlined />,
        element: <ComponentList />,
        // children:[
        //     {
        //         title: <Navigate to='/sys/component/:id' relative='path'>零件详情</Navigate>,
        //         path: '/:id',
        //         key: 'componentid',
        //         icon: <PartitionOutlined />,
        //         element: <ComponentDetail />, //todo
        //     }
        // ]
    },
    {
        title: <Link to='/size'>尺寸列表</Link>,
        path: 'size',
        key: 'size',
        icon: <InfoCircleOutlined />,
        element: <SizeList />,
    },
    {
        title: <Link to='/exam'>考核管理</Link>,
        path: 'exam',
        key: 'exam',
        icon: <PartitionOutlined />,
        element: <ExamList />, //todo

    }
]
export const unAuthRoutes: IRouter[] = [
    {
        title: '登录',
        path: '/login',
        key: 'login',
        icon: <LoginOutlined />,
        element: <Login />
    },
    {
        title: 'NotFound',
        path: '*',
        key: '404',
        icon: <DownOutlined />,
        element: <Page404 />
    }
]
export const studentRoutes: IRouter[] = [
    {
        title: '考核信息',
        path: '/student',
        key: 'student',
        icon: <PartitionOutlined />,
        children: [
            {
                title: <Link to='/student/exams'>考核列表</Link>,
                path: 'exams',
                key: 'student_exams',
                icon: <PartitionOutlined />,
                element: <Exams />
            },
        ]
    },
    {
        title: <Link to='/auth/modify'>修改密码</Link>,
        path: '/auth/modify',
        key: 'auth',
        icon: <InfoCircleOutlined />,
        element: <ChangePassword />
    }
]

export const adminRoutes: IRouter[] = [
    {
        title: '教师管理',
        path: '/admin/teacher',
        key: 'teacher',
        icon: <PartitionOutlined />,
        children: [
            {
                title: <Link to='/admin/teacher/list'>教师列表</Link>,
                path: '/admin/teacher/list',
                key: 'teacher list',
                icon: <PartitionOutlined />,
                element: <TeacherList />
            },
        ]
    },
    {
        title: '学生管理',
        path: '/admin/student',
        key: 'student',
        icon: <InfoCircleOutlined />,
        children: [
            {
                title: <Link to='/admin/student/list'>学生列表</Link>,
                path: '/admin/student/list',
                key: 'stuList',
                icon: <PartitionOutlined />,
                element: <StudentList />
            },
            // {
            //     title: <Link to='/admin/student/upload'>学生上传</Link>,
            //     path: '/admin/student/upload',
            //     key: 'stuUpload',
            //     icon: <PartitionOutlined />,
            //     element: <StudentUpload />
            // }
        ]
    },
    {
        title: '工具管理',
        path: '/admin/tool',
        key: 'tool',
        icon: <PartitionOutlined />,
        children: [
            {
                title: <Link to='/admin/tool/list'>工具列表</Link>,
                // title: 'etst',
                path: '/admin/tool/list',
                key: 'tools',
                icon: <PartitionOutlined />,
                element: <ToolList />
            },
        ]
    },
    {
        title: <Link to='/admin/password/reset'>密码重置</Link>,
        path: '/admin/password/reset',
        key: 'reset',
        icon: <PartitionOutlined />,
        element: <TeacherList />,
    },
    {
        title: <Link to='/auth/modify'>修改密码</Link>,
        path: '/auth/modify',
        key: 'auth',
        icon: <InfoCircleOutlined />,
        element: <ChangePassword />
    }
]

export default routers