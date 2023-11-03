import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';

import DashBoard from '../../Components/admin/dashboard/DashBoard';
import TicketList from '../../Components/admin/ticketList/TicketList';
import House from '../../Components/admin/history/House';
import UserList from '../../Components/admin/userList/UserList';
import Reports from '../../Components/admin/report/Reports';
import useScript from '../../Hooks/custom/useScript';
import Layout from '../../Components/admin/layout/Layout';
import Error from '../../Components/AirBnb/Error/Error';


import "bootstrap/dist/js/bootstrap.min";
import "../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/css/app.min.css";
import "../../assets/css/icons.min.css";
import "../../App.css";
import HeaderItem from '../../Components/admin/layout/HeaderItem';
import UserBan from '../../Components/admin/userList/UserBan';
import Refund from '../../Components/admin/process/Refund';
import HouseBan from '../../Components/admin/history/HouseBan';
import RefundCreate from '../../Components/admin/policy/RefundCreate';
import RefundPolicyTable from '../../Components/admin/policy/RefundPolicyTable';
// import '../../component/layout_hosting/navbarHosting.css';




function RoutesAdmin() {
  return (
    <div className='local-bootstrap'>
      <Layout>
        <Routes>
          <Route path='/' element={<DashBoard />} />
          <Route path='/tickets' element={<TicketList />} />
          <Route path='/houses' element={<House />} />
          <Route path='/houseBan' element={<HouseBan />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/banList' element={<UserBan />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/refund' element={<Refund />} />
          <Route path='/refundPolicy' element={<RefundPolicyTable />} />
          <Route path='/createRefund' element={<RefundCreate />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default RoutesAdmin;
