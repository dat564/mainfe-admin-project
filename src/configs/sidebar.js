import { DashboardOutlined, TableOutlined, UserOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import Accounts from 'pages/admin/accounts';
import Car from 'pages/admin/car';
import Dashboard from 'pages/admin/dashboard';
import DashBoardTransportCompany from 'pages/transportCompany/dashboard';
import Payment from 'pages/admin/payment';
import Ticket from 'pages/admin/ticket';
import VourcherPage from 'pages/admin/vourcher';
import TransportCompany from 'pages/admin/transportCompany';
import Trip from 'pages/admin/trip';
import CalendarTrip from 'pages/transportCompany/calendarTrip';
import Drivers from 'pages/transportCompany/drivers';
import CompanyPayment from 'pages/transportCompany/payment';
import TemplateCalendarTrip from 'pages/transportCompany/templateCalendarTrip';
import BillPage from 'pages/transportCompany/bill';
import Reconciled from 'pages/admin/reconciled';

export const sideBar = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    to: '/',
    component: <Dashboard />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    to: '/transport_company',
    component: <DashBoardTransportCompany />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'accounts',
    title: 'Quản lý tài khoản',
    icon: <UserOutlined />,
    to: '/accounts',
    component: <Accounts />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'accounts',
    title: 'Quản lý tài xế',
    icon: <UserOutlined />,
    to: '/drivers',
    component: <Drivers />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'trips',
    title: 'Quản lý chuyến',
    icon: <TableOutlined />,
    to: '/trips',
    component: <Trip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'transport_company',
    title: 'Quản lý nhà xe',
    icon: <TableOutlined />,
    to: '/transport-company',
    component: <TransportCompany />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'cars',
    title: 'Quản lý xe',
    icon: <TableOutlined />,
    to: '/cars',
    component: <Car />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'tickets',
    title: 'Quản lý vé',
    icon: <TableOutlined />,
    to: '/tickets',
    component: <Ticket />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'payment-method',
    title: 'Phương thức thanh toán',
    icon: <TableOutlined />,
    to: '/payment-method',
    component: <Payment />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'reconciled',
    title: 'Quản lý thông tin đối soát',
    icon: <TableOutlined />,
    to: '/reconciled',
    component: <Reconciled />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'transport-company-payment',
    title: 'Quản lý thông tin đối soát',
    icon: <TableOutlined />,
    to: '/transport-company-payment',
    component: <CompanyPayment />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'calendar-trip',
    title: 'Quản lý lịch trình',
    icon: <TableOutlined />,
    to: '/calendar-trip',
    component: <CalendarTrip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'template-calendar-trip',
    title: 'Quản lý mẫu lịch trình',
    icon: <TableOutlined />,
    to: '/template-calendar-trip',
    component: <TemplateCalendarTrip />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'vourcher',
    title: 'Quản lý phiếu giảm giá',
    icon: <TableOutlined />,
    to: '/vourcher',
    component: <VourcherPage />,
    roles: [ROLES.ADMIN]
  },
  {
    key: 'bill',
    title: 'Đơn hàng',
    icon: <TableOutlined />,
    to: '/bill',
    component: <BillPage />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'rating',
    title: 'Đánh giá',
    icon: <TableOutlined />,
    to: '/rating',
    component: <BillPage />,
    roles: [ROLES.TRANSPORT_COMPANY]
  },
  {
    key: 'rating-admin',
    title: 'Xem đánh giá',
    icon: <TableOutlined />,
    to: '/rating-admin',
    component: <BillPage />,
    roles: [ROLES.ADMIN]
  }
];
