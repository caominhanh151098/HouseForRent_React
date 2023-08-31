import useScript from './custom/admin/useScript';
import React, { useEffect, useState } from 'react';
import './App.css';
<<<<<<< Updated upstream
import Header from './Components/AirBnb/Header/Header';
import Body from './Components/AirBnb/Body/Body';
import Footer from './Components/AirBnb/Footer/Footer';
=======
import Layout from './components/admin/layout/Layout';
import us from "./assets/images/animat-rocket-color.gif";
import axios from 'axios';
>>>>>>> Stashed changes

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  // useScript("./assets/js/vendor.min.js");
  // useScript("./assets/js/app.min.js");
  // useScript("https://npmcdn.com/babel-core@5.8.38/browser.min.js")
  useScript("https://getbootstrap.com/docs/5.0/dist/js/bootstrap.bundle.min.js", "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM");
  useScript("https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js", "sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE");
  useScript("https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js", "sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha");
  // useScriptNoInte("https://getbootstrap.com/docs/5.0/examples/dashboard/dashboard.js");
  useEffect(() => {
    async function getData() {
      const response = await axios.get(`http://localhost:8080/api/admin/users?page=${page}`);
      console.log(response);
      setUsers(response.data.content);
      setTotalPage();
    };
    getData()
  }, [page]);

  const handleRenderPagination = () => {
    const pages = [];

    
  }
  return (
<<<<<<< Updated upstream
    <div className="App">
      <Header/>
      <Body/>
      <Footer/>
    </div>
=======

    <>
      <Layout>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className='h2'>Customers</h1>
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-sm text-center '>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>First Name</th>
                <th scope='col'>Last Name</th>
                <th scope='col'>Email</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr>
                  <td className='align-middle'>{user.id}</td>
                  <td>
                    <div className='d-flex align-items-center justify-content-center'>
                      <img style={{ width: "50px", height: "50px",borderRadius: "50%" }} src={user.avatar || us} alt='img' />
                      {user.firstName}
                    </div>
                  </td>
                  <td className='align-middle'>{user.lastName}</td>
                  <td className='align-middle'>{user.email}</td>
                  <td className='align-middle'>
                    <button className='btn btn-danger me-2'>Ban</button>
                    <button className='btn btn-warning'>UnBan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='d-flex justify-content-center'>
            <nav className='' aria-label="...">
              <ul class="pagination">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>

                <li class="page-item"><a class="page-link" href="#">1</a></li>
                {handleRenderPagination}
                {/* <li class="page-item active" aria-current="page">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">3</a></li> */}
                <li class="page-item">
                  <a class="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Layout>
    </>
>>>>>>> Stashed changes
  );
}

export default App;
