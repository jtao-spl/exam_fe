import React, { lazy, ReactNode } from 'react';
import { HomeOutlined, LoginOutlined, PartitionOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const Login = lazy(() => import('../pages/Login'));
const ComponentList = lazy(() => import('../pages/component/ComponentList'));
const SizeList = lazy(() => import('../pages/size/SizeList'));
const Page404 = lazy(() => import('../pages/Page404'));
const ExamList = lazy(() => import('../pages/exam/ExamList'));
const Exams = lazy(()=>import('../pages/student/Exams'))
export interface IRouter {
    title: React.ReactNode,
    path: string,
    key: string,
    icon: React.ReactNode,
    index?: boolean,
    exact?: boolean,
    element?: ReactNode,
    children?: IRouter[]
}

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
export const studentRoutes:IRouter[] = [
    {
        title: '考核信息',
        path: '/stu',
        key: 'student',
        icon: <PartitionOutlined />,
        children:[
            {
                title: <Link to='/stu/exams'>考核列表</Link>,
                path: 'exams',
                key: 'student_exams',
                icon: <PartitionOutlined />,
                element: <Exams />
            },
        ]
    },
]

export default routers