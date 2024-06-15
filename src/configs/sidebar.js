import { DashboardOutlined, TableOutlined, UserOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import Accounts from 'pages/admin/accounts';
import Car from 'pages/admin/car';
import Dashboard from 'pages/admin/dashboard';
import Payment from 'pages/admin/payment';
import Ticket from 'pages/admin/ticket';
import TransportCompany from 'pages/admin/transportCompany';
import Trip from 'pages/admin/trip';
import CalendarTrip from 'pages/transportCompany/calendarTrip';
import CompanyPayment from 'pages/transportCompany/payment';
import TemplateCalendarTrip from 'pages/transportCompany/templateCalendarTrip';

export const sideBar = [
  {
    key: 1,
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    to: '/',
    component: <Dashboard />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 2,
    title: 'Quản lý tài khoản',
    icon: <UserOutlined />,
    to: '/accounts',
    component: <Accounts />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 3,
    title: 'Quản lý chuyến',
    icon: <TableOutlined />,
    to: '/trips',
    component: <Trip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 4,
    title: 'Quản lý nhà xe',
    icon: <TableOutlined />,
    to: '/transport-company',
    component: <TransportCompany />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 5,
    title: 'Quản lý xe',
    icon: <TableOutlined />,
    to: '/cars',
    component: <Car />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 6,
    title: 'Quản lý vé',
    icon: <TableOutlined />,
    to: '/tickets',
    component: <Ticket />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 7,
    title: 'Phương thức thanh toán',
    icon: <TableOutlined />,
    to: '/payment-method',
    component: <Payment />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 8,
    title: 'Phương thức thanh toán',
    icon: <TableOutlined />,
    to: '/transport-company-payment',
    component: <CompanyPayment />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 9,
    title: 'Quản lý lịch trình',
    icon: <TableOutlined />,
    to: '/calendar-trip',
    component: <CalendarTrip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 10,
    title: 'Quản lý mẫu lịch trình',
    icon: <TableOutlined />,
    to: '/template-calendar-trip',
    component: <TemplateCalendarTrip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  }
];
