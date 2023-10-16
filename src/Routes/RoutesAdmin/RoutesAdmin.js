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
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "../../../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/css/app.min.css";
import "../../assets/css/icons.min.css";
import "../../App.css";



function RoutesAdmin() {

  // useScript("https://getbootstrap.com/docs/5.0/dist/js/bootstrap.bundle.min.js", "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM");
  // useScript("https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js", "sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE");
  // useScript("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js", "sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha");


  return (
    <>
     <React.Fragment>
      <Routes>
        <Route
          path='/admin/*'
          element={
            <Layout>
              <Routes>
                <Route index element={<DashBoard />} />
                <Route path='tickets' element={<TicketList />} />
                <Route path='houses' element={<House />} />
                <Route path='users' element={<UserList />} />
                <Route path='reports' element={<Reports />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </React.Fragment>
    </>
  );
}

export default RoutesAdmin;
