import AdminLayout from 'layouts/admin';
import AuthLayout from 'layouts/auth';
import AccountPage from 'pages/admin/accounts';
import Login from 'pages/admin/login';
import ProfilePage from 'pages/admin/profile';
import TransportCompanyPage from 'pages/admin/transportCompany';
import TripPage from 'pages/admin/trip';
import TicketPage from 'pages/admin/ticket';
import CarPage from 'pages/admin/car';
import TransportCompanyPaymentPage from 'pages/transportCompany/payment';
import ErrorPage from 'pages/error';
import PaymentPage from 'pages/admin/payment';
import Dashboard from 'pages/admin/dashboard';
import CalendarTripPage from 'pages/transportCompany/calendarTrip';
import DriverPage from 'pages/transportCompany/drivers';
import TemplateCalendarTripPage from 'pages/transportCompany/templateCalendarTrip';
import VourcherPage from 'pages/admin/vourcher';
import BillPage from 'pages/transportCompany/bill';
import RatingPage from 'pages/transportCompany/rating';

const routes = [
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/accounts',
        element: <AccountPage />
      },
      {
        path: '/drivers',
        element: <DriverPage />
      },
      {
        path: '/transport-company',
        element: <TransportCompanyPage />
      },
      {
        path: '/cars',
        element: <CarPage />
      },
      {
        path: '/trips',
        element: <TripPage />
      },
      {
        path: '/tickets',
        element: <TicketPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/payment-method',
        element: <PaymentPage />
      },
      {
        path: '/transport-company-payment',
        element: <TransportCompanyPaymentPage />
      },
      {
        path: '/transport-company-payment',
        element: <TransportCompanyPaymentPage />
      },
      {
        path: '/calendar-trip',
        element: <CalendarTripPage />
      },
      {
        path: '/template-calendar-trip',
        element: <TemplateCalendarTripPage />
      },
      {
        path: '/vourcher',
        element: <VourcherPage />
      },
      {
        path: '/bill',
        element: <BillPage />
      },
      {
        path: '/rating',
        element: <RatingPage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: 'login', element: <Login /> }]
  }
];

export default routes;
