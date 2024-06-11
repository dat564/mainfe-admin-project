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
import TemplateCalendarTripPage from 'pages/transportCompany/templateCalendarTrip';
import TestPage from 'pages/admin/test';

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
        path: '/transport_company',
        element: <TransportCompanyPage />
      },
      {
        path: '/car',
        element: <CarPage />
      },
      {
        path: '/trip',
        element: <TripPage />
      },
      {
        path: '/ticket',
        element: <TicketPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/payment_method',
        element: <PaymentPage />
      },
      {
        path: '/transport_company_payment',
        element: <TransportCompanyPaymentPage />
      },
      {
        path: '/transport_company_payment',
        element: <TransportCompanyPaymentPage />
      },
      {
        path: '/calendar_trip',
        element: <CalendarTripPage />
      },
      {
        path: '/template_calendar_trip',
        element: <TemplateCalendarTripPage />
      },
      {
        path: '/test',
        element: <TestPage />
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
