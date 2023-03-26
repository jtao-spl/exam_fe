import { Menu, MenuProps } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import routers, { adminRoutes, IRouter, studentRoutes, teacherRouters } from '../router';
import { get } from '../utils/storage';

type MenuItem = Required<MenuProps>['items'][number];
const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const generateMenu = (routers?: IRouter[]): MenuItem[] | undefined => {
  return routers?.map(route => {
    if (route.children) {
      return getItem(route.title, route.key, route.icon, generateMenu(route.children));
    }
    return getItem(route.title, route.key, route.icon, route.children);
  })
}

const teacherItems: MenuProps['items'] = generateMenu(teacherRouters);
const adminItems: MenuProps['items'] = generateMenu(adminRoutes);
// const items: MenuProps['items'] = generateMenu(routers);
const studentItems: MenuProps['items'] = generateMenu(studentRoutes)
export default function SiderLayout() {
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>();

  const location = useLocation();
  const highlightMenu = (leftRoutes: IRouter[]) => {
    const path = location.pathname;
    for (let r of leftRoutes) {
      let match = matchPath(r.path, path)
      if (match || path.includes(r.path)) {
        if (r.children) {
          setDefaultSelectedKeys([r.key]);
        }
        else {
          setDefaultOpenKeys([r.key])
        }
      }
      if (r.children) {
        highlightMenu(r.children)
      }
    }
  }
  useEffect(() => {
    if (get('role') === '1') {
      highlightMenu(adminRoutes)
    }
    if (get('role') === '2') {
      highlightMenu(teacherRouters)
    }
    if (get('role') === '3') {
      highlightMenu(studentRoutes)
    }
  }, [])

  const onClick = (info: MenuInfo) => {
    console.log(info);
    console.log(defaultSelectedKeys)
    console.log(defaultOpenKeys)
  }

  return (
    <Sider
      // style={{
      //   overflow: 'auto',
      //   height: '100vh',
      //   position: 'fixed',
      //   left: 0,
      //   top: 0,
      //   bottom: 0,
      // }}
      width={200}
      className="site-layout-background"
    >
      {
        defaultSelectedKeys && defaultSelectedKeys.length > 0 ?
          <Menu
            mode="inline"
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            style={{ height: '100%', borderRight: 0 }}
            items={get('role') === '1' ? adminItems : get('role') === '2' ? teacherItems : studentItems}
            onClick={onClick} />
          :
          null
      }
    </Sider>
  )

}
