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

function RoutesAdmin() {
  
  useScript("https://getbootstrap.com/docs/5.0/dist/js/bootstrap.bundle.min.js", "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM");
  useScript("https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js", "sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE");
  useScript("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js", "sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha");
  

  return (
    <>
      <Layout>
        <Routes>
          <Route path='/admin' element={<DashBoard/>}/>
          <Route path='/admin/tickets' element = {<TicketList/>}/>
          <Route path='/admin/houses' element = {<House/>}/>
          <Route path='/admin/users' element={<UserList/>}/>
          <Route path='/admin/reports' element={<Reports/>}/>
        </Routes>
      </Layout>
    </>
  );
}

export default RoutesAdmin;
