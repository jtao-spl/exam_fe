import { Breadcrumb } from 'antd';
import React from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { adminRoutes, IRouter, studentRoutes, teacherRouters } from '../router';
import { get } from '../utils/storage';

export default function SubTitle() {
    const location = useLocation();
    const generateSubTitle = (routes: IRouter[]) => {
        return (<div>{routes.map((r: IRouter) => {
            let match = matchPath(r.path, location.pathname);
            if (match || location.pathname.includes(r.path)) {
                return (<div key={r.key}>
                    <Breadcrumb.Item key={r.key}>{r.title}</Breadcrumb.Item>
                    {
                        r.children ?
                            generateSubTitle(r.children)
                            :
                            null
                    }
                </div>)
            }
            return null;
        })}</div>)
    }

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                {get('role') === '1' && generateSubTitle(adminRoutes)}
                {get('role') === '2' && generateSubTitle(teacherRouters)}
                {get('role') === '3' && generateSubTitle(studentRoutes)}
            </Breadcrumb>
        </>
    );
}
