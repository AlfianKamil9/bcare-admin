import LayoutsAdmin from '@/component/LayoutsAdmin';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [getKonselor, setGetKonselor] = useState([]);
  const [getUsers, setDataUsers] = useState([]);
  const [getKonseling, setGetKonseling] = useState([]);
  const [getArtikels, setGetArtikels] = useState([]);
  const [getVideo, setGetVideo] = useState([]);
  const [getOrder, setGetOrder] = useState([]);
  const [getOrderPending, setGetOrderPending] = useState([]);
  const [getOrderCanceled, setGetOrderCanceled] = useState([]);

  const fetchKonselor = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/admin-only/v1/konselor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetKonselor(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchVideo = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/v1/video', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetVideo(res.data.data);
    } catch (error) {}
  };
  const fetchKonseling = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/v1/konseling', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetKonseling(res.data.data);
    } catch (error) {}
  };

  const fetchArtikels = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/v1/artikel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetArtikels(res.data.data);
    } catch (error) {}
  };

  const fetchUsers = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/admin-only/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
      });
      const datas = res.data.data;
      setDataUsers(datas);
    } catch (error) {}
  };
  const fetchOrder = async (token) => {
    const res = await axios.get('http://34.101.42.219:5000/api/admin-only/v1/order-konseling', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGetOrder(res.data.data);
  };
  const fetchOrderStatus = async (token, status) => {
    const res = await axios.get('http://34.101.42.219:5000/api/admin-only/v1/order-konseling/' + status, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (status === 'pending') {
      setGetOrderPending(res.data.data);
    } else {
      setGetOrderCanceled(res.data.data);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchKonselor(token);
    fetchUsers(token);
    fetchKonseling(token);
    fetchArtikels(token);
    fetchVideo(token);
    fetchOrder(token);
    fetchOrderStatus(token, 'pending');
    fetchOrderStatus(token, 'canceled');
  }, []);
  return (
    <>
      <LayoutsAdmin title="Dashboards">
        <div className="m-3">
          <div
            className="card shadow-lg border-0"
            style={{ height: '99%' }}
          >
            <div className="card-body">
              <h5 className="fw-bold text-primary">DASHBOARD</h5>
            </div>
          </div>
          {/*  */}

          <div className="card shadow-lg border-0 mt-3 b-100">
            <div className="card-body content-list">
              <div className="row justify-content-center">
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-primary text-light">
                    <div className="card-body">
                      <h5>USERS</h5>
                      <h1 className="fw-bold">{getUsers.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-success bg-opacity-75 text-light">
                    <div className="card-body">
                      <h5>KONSELINGS</h5>
                      <h1 className="fw-bold">{getKonseling.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-secondary text-light">
                    <div className="card-body">
                      <h5>ARTIKELS</h5>
                      <h1 className="fw-bold">{getArtikels.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-info text-light">
                    <div className="card-body">
                      <h5>VIDEOS</h5>
                      <h1 className="fw-bold">{getVideo.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-success text-light">
                    <div className="card-body">
                      <h5>ORDERS</h5>
                      <h1 className="fw-bold">{getOrder.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-success text-light">
                    <div className="card-body">
                      <h5>KONSELOR</h5>
                      <h1 className="fw-bold">{getKonselor.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-warning text-light">
                    <div className="card-body">
                      <h5>PENDING</h5>
                      <h1 className="fw-bold">{getOrderPending.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mt-3 mb-3">
                  <div className="card bg-danger text-light">
                    <div className="card-body">
                      <h5>CANCEL</h5>
                      <h1 className="fw-bold">{getOrderCanceled.length}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-profile"></div>
            </div>
          </div>
        </div>
      </LayoutsAdmin>
    </>
  );
};

export default Dashboard;
