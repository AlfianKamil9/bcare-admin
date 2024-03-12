import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
const Orders = () => {
  const [getOrder, setGetOrder] = useState([]);
  const [tokens, setTokens] = useState('');
  const [dataDetail, setDataDetail] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [ref, setRef] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [linksZoom, setLinksZoom] = useState();
  const closeDelete = () => setShowDelete(false);
  const closeAccept = () => setShowAccept(false);
  const closeDetail = () => setShowDetail(false);

  const onChangeInputValue = (e) => {
    setLinksZoom({ ...linksZoom, [e.target.name]: e.target.value });
  };

  // LAUNCH REJECT
  const launchDelete = (ref) => {
    setRef(ref);
    setShowDelete(true);
  };
  // Launch Dwtails
  const launchDetail = (ref) => {
    setShowDetail(true);
    setDataDetail(getOrder.find((item) => item.reference_code === ref));
    dataDetail.Konseling = {};
    console.log(dataDetail);
  };
  // Launch  Accept Confirmation
  const launchAccept = (ref) => {
    setShowAccept(true);
    setRef(ref);
  };

  const fetchOrder = async (token) => {
    try {
      const res = await axios.get('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/order-konseling', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetOrder(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const declineOrder = async (token, ref) => {
    try {
      const res = await axios.delete('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/order-konseling/rejecting/' + ref, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (token, ref, body) => {
    try {
      const res = await axios.put('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/order-konseling/accepting/' + ref, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE REJECT
  const handleReject = async () => {
    console.log(ref);
    await declineOrder(tokens, ref);
    setShowDelete(false);
    await fetchOrder(tokens);
  };
  // HANDLE ACCEPT
  const handleAccept = async () => {
    console.log(tokens, ref.toString(), linksZoom);
    await acceptOrder(tokens, ref, linksZoom);
    setShowAccept(false);
    await fetchOrder(tokens);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    setTokens(token);
    fetchOrder(token);
  }, []);
  return (
    <>
      <LayoutsAdmin title="All Orders">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                ORDERS <span className="badge bg-info"> {getOrder.length}</span>
              </h5>
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3 h-100">
            <div className="card-body content-list">
              <div className="content-profile table-responsive m-2">
                <table className="table table-bordered border-primary">
                  <thead className="bg-info">
                    <tr>
                      <th>REF</th>
                      <th>PEMBELI</th>
                      <th>LAYANAN</th>
                      <th>TOTAL HARGA</th>
                      <th>STATUS</th>
                      <th>TRANSFER</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOrder.map((order) => (
                      <>
                        <tr>
                          <td>{order.reference_code}</td>
                          <td>{order.User.name}</td>
                          <td>{order.Konseling.title_konseling}</td>
                          <td>Rp. {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total_price)} </td>
                          <td>
                            <div className="justify-content-center">
                              {order.status == 'CANCELED' ? (
                                <>
                                  {' '}
                                  <span className="bg-danger badge rounded text-light p-1">CANCELED</span>
                                </>
                              ) : order.status == 'PENDING' ? (
                                <>
                                  <span className="bg-warning badge rounded text-light p-1">PENDING</span>
                                </>
                              ) : order.status == 'SUCCESS' ? (
                                <>
                                  {' '}
                                  <span className="bg-success badge rounded text-light p-1">SUCCESS</span>
                                </>
                              ) : (
                                <>
                                  {' '}
                                  <span className="bg-primary badge rounded text-light p-1">REVIEWING</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td>{moment(order.dateline_transfer).format('DD MMMM YYYY , HH:mm')}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              {order.status == 'CANCELED' || order.status == 'PENDING' || order.status == 'SUCCESS' ? (
                                <>
                                  <button
                                    className="btn btn-light m-1"
                                    disabled
                                  >
                                    {' '}
                                    <Icon
                                      icon="mdi:approve"
                                      width="20"
                                      height="20"
                                      style={{ color: '#1C241A' }}
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-light m-1"
                                    onClick={() => launchAccept(order.reference_code)}
                                  >
                                    {' '}
                                    <Icon
                                      icon="mdi:approve"
                                      width="20"
                                      height="20"
                                      style={{ color: '#1d8500' }}
                                    />
                                  </button>
                                </>
                              )}

                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDetail(order.reference_code)}
                              >
                                {' '}
                                <Icon
                                  icon="mdi:eye"
                                  width="20"
                                  height="20"
                                  style={{ color: '#1908B2' }}
                                />
                              </button>
                              {order.status === 'CANCELED' || order.status === 'PENDING' || order.status == 'SUCCESS' ? (
                                <>
                                  <button
                                    className="btn btn-light m-1"
                                    disabled
                                    onClick={() => launchDelete(order.reference_code)}
                                  >
                                    <Icon
                                      icon="fluent:text-change-reject-20-regular"
                                      width="20"
                                      height="20"
                                      style={{ color: '#1C241A' }}
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-light m-1"
                                    onClick={() => launchDelete(order.reference_code)}
                                  >
                                    <Icon
                                      icon="fluent:text-change-reject-20-regular"
                                      width="20"
                                      height="20"
                                      style={{ color: '#99130a' }}
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                    {getOrder.length < 1 ? (
                      <>
                        <tr>
                          <td colSpan={7}>
                            <center className="m-3">
                              <h6 className="fw-bold">
                                <i>Tidak Ada Data</i>
                              </h6>
                            </center>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL ACCEPT */}
        <Modal
          show={showAccept}
          onHide={closeAccept}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>ACCEPT ORDER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAccept}>
              <div className="mb-3">
                <label
                  for="exampleInputEmail1"
                  className="form-label"
                >
                  Link Zoom
                </label>
                <input
                  type="link"
                  className="form-control"
                  id=""
                  aria-describedby=""
                  placeholder="Entry Link Zoom"
                  name="link_zoom"
                  onChange={onChangeInputValue}
                />
              </div>
              <Modal.Footer className="pt-2">
                <Button
                  variant="secondary"
                  onClick={closeAccept}
                >
                  Close
                </Button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="btn btn-danger"
                >
                  Accept
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/*  */}
        {/* MODAL REJECT */}
        <Modal
          show={showDelete}
          onHide={closeDelete}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>REJECT ORDER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <h5 className="m-3 text-danger">
                {' '}
                Are You Sure to reject Order <br />
                {ref} ?
              </h5>
            </center>
            <Modal.Footer className="pt-2">
              <Button
                variant="secondary"
                onClick={closeDelete}
              >
                Close
              </Button>
              <button
                type="button"
                onClick={handleReject}
                className="btn btn-danger"
              >
                Reject
              </button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

        {/*  */}

        {/* MODAL VIEW */}
        <Modal
          show={showDetail}
          onHide={closeDetail}
          size="lg"
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>DETAIL ORDER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="m-3">
              <table className="table table-bordered border-primary">
                <thead className="bg-info fw-bold">
                  <tr className="bg-info fw-bold">
                    <th>PARAMETER</th>
                    <th>VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>REFERENCE CODE</td>
                    <td>{dataDetail.reference_code}</td>
                  </tr>
                  <tr>
                    <td>TOTAL HARGA</td>
                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dataDetail.total_price)}</td>
                  </tr>
                  <tr>
                    <td>BATAS TRANSFER</td>
                    <td>{moment(dataDetail.dateline_transfer).format('DD MMMM YYYY , HH:mm ')} WIB</td>
                  </tr>
                  <tr>
                    <td>STATUS</td>
                    <td>
                      {dataDetail.status == 'CANCELED' ? (
                        <>
                          {' '}
                          <span className="bg-danger badge rounded text-light p-1">CANCELED</span>
                        </>
                      ) : dataDetail.status == 'PENDING' ? (
                        <>
                          <span className="bg-warning badge rounded text-light p-1">PENDING</span>
                        </>
                      ) : dataDetail.status == 'SUCCESS' ? (
                        <>
                          {' '}
                          <span className="bg-success badge rounded text-light p-1">SUCCESS</span>
                        </>
                      ) : (
                        <>
                          {' '}
                          <span className="bg-primary badge rounded text-light p-1">REVIEWING</span>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>PEMBELI</td>
                    <td>{dataDetail.User?.name}</td>
                  </tr>
                  <tr>
                    <td>LAYANAN DIPESAN</td>
                    <td>{dataDetail.Konseling?.title_konseling}</td>
                  </tr>

                  <tr>
                    <td>KONSELOR YANG BERTUGAS</td>
                    <td>{dataDetail.Konseling?.konselor.name_konselor}</td>
                  </tr>
                  <tr>
                    <td>BUKTI TRANSFER</td>
                    <td>
                      {dataDetail.transfer_proof === null ? (
                        <>
                          <i>Belum ada bukti transfer</i>
                        </>
                      ) : (
                        <>
                          <Image
                            src={dataDetail.transfer_proof}
                            alt="proof_transfer"
                            width={200}
                            height={100}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>LINK ZOOM</td>
                    <td>
                      {dataDetail.link_zoom == null ? (
                        <>
                          <i>Belum ada Link Zoom</i>
                        </>
                      ) : (
                        dataDetail.link_zoom
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={closeDetail}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </LayoutsAdmin>
    </>
  );
};

export default Orders;
