import { Breadcrumb } from 'antd';
import React from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import routers, { adminRoutes, IRouter, studentRoutes, teacherRouters } from '../router';
import { get } from '../utils/storage';

export default function SubTitle() {
    const location = useLocation();
    const generateSubTitle = (routes: IRouter[]) => {
        return (<>{getNodes(routes)}</>)
    }
    const getNodes = (routers: IRouter[]) => {
        const result = routers.map((r: IRouter) => {
            let match = matchPath(r.path, location.pathname);
            if (match || location.pathname.includes(r.path)) {
                const nodes = [<Breadcrumb.Item key={r.key}>{r.title}</Breadcrumb.Item>]
                if (r.children) {
                    nodes.push(...getNodes(r.children))
                }
                return nodes;
            }
            return []
        })
        return result.flat();
    }

    return (
        <>
            <Breadcrumb separator=">" style={{margin:'16px 0'}}>
                {get('role') === '1' && generateSubTitle(adminRoutes)}
                {get('role') === '2' && generateSubTitle(teacherRouters)}
                {get('role') === '3' && generateSubTitle(studentRoutes)}
            </Breadcrumb>
        </>
    );
}
