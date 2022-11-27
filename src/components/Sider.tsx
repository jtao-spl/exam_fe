import { Menu, MenuProps } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';
import routers, { IRouter, studentRoutes } from '../router';
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

const items: MenuProps['items'] = generateMenu(routers);
const studentItems: MenuProps['items'] = generateMenu(studentRoutes)
export default function SiderLayout() {
  const onClick = (info: MenuInfo) => {
    console.log(info);
  }
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
        items={get('role') === '3'? studentItems: items}
        onClick={onClick} />


    </Sider>
  )

}
