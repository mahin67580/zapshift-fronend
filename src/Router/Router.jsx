
import { createBrowserRouter, } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import Authlayout from "../layout/Authlayout";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
import Privateroute from "../private/Privateroute";
import SendPercel from "../component/SendPercel";
import DahboardLayout from "../layout/DahboardLayout";
import Myparcels from "../pages/dashboard/Myparcels";
import Stats from "../component/Stats";
import Payment from "../payment/Payment";
import PaymentHistory from "../payment/PaymentHistory";
import MyProfile from "../component/MyProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,

        Component: Home
      },
      {
        path: '/sendparcel',
        loader: () => fetch('/public/warehouses.json'),
        element:
          <Privateroute>
            <SendPercel></SendPercel>
          </Privateroute>
      },
      {
        path: '/myprofile',
        element: (
          <Privateroute>
            <MyProfile />
          </Privateroute>
        )
      },
    ]
  },
  {
    path: '/',
    Component: Authlayout,
    children:
      [
        {
          path: '/login',
          Component: Login
        },
        {
          path: '/register',
          Component: Register
        }
      ]
  },
  {
    path: '/dashboard',
    element: <Privateroute>
      <DahboardLayout></DahboardLayout>
    </Privateroute>,
    children: [
      {
        path: 'mypacels',
        Component: Myparcels
      },

      {
        path: 'stats',
        Component: Stats
      },
      {
        path: 'paymentHistory',
        Component: PaymentHistory
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },
    ]
  }
]);