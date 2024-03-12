import LayoutsAdmin from '@/component/LayoutsAdmin';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import process from 'process';
import axios from 'axios';
import Cookies from 'js-cookie';

const Users = () => {
  const [dataUsers, setDataUsers] = useState([]);
  let i = 1;
  const fetchUsers = async (token) => {
    try {
      const res = await axios.get('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
      });
      console.log(res.data);
      setDataUsers(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    const token = Cookies.get('token');
    fetchUsers(token);
  }, []);
  return (
    <>
      <LayoutsAdmin title="Users">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                USERS <span className="badge bg-info"> {dataUsers.length}</span>
              </h5>
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3 h-100">
            <div className="card-body content-list">
              <div className="content-profile table-responsive m-2">
                <table className="table table-bordered border-primary">
                  <thead className="bg-info">
                    <tr>
                      <th>NO.</th>
                      <th>NAMA</th>
                      <th>EMAIL</th>
                      <th>ROLES</th>
                      <th>EMAIL FAMILY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataUsers.map((users) => (
                      <>
                        <tr>
                          <td>{i++}</td>
                          <td>{users.name}</td>
                          <td>{users.email}</td>
                          <td>
                            <center>
                              {users.roles == 'user' ? (
                                <>
                                  <span className="bg-info rounded text-light p-1">USER</span>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <span className="bg-dark rounded text-light p-1">ADMIN</span>
                                </>
                              )}
                            </center>
                          </td>
                          <td>{users.familyEmail}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </LayoutsAdmin>
    </>
  );
};

export default Users;
