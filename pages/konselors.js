import React, { useEffect, useState } from 'react';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Cookies from 'js-cookie';

const Konselors = () => {
  const [alert, setAlert] = useState(false);
  const handleClose = () => setAlert(false);
  const [alertFor, setAlertFor] = useState('');

  const [getDataKonselor, setGetDataKonselor] = useState([]);
  const [image, setImage] = useState('');
  const [modalFor, setModalFor] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [id, setId] = useState('');
  const [tokens, setTokens] = useState('');
  const closeDetail = () => setShowDetail(false);
  const [show, setShow] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const closeDelete = () => setShowDelete(false);
  const [konfirmasi, setKonfirmasi] = useState('');
  const closeAdd = () => setShow(false);

  const [dataKonselor, setDataKonselor] = useState({
    name_konselor: '',
    email_konselor: '',
    deskripsi_konselor: '',
  });
  const onChangeInputValue = (e) => {
    setDataKonselor((prevDev) => ({ ...prevDev, [e.target.name]: e.target.value }));
  };
  const body = {
    name_konselor: dataKonselor.name_konselor,
    email_konselor: dataKonselor.email_konselor,
    deskripsi_konselor: dataKonselor.deskripsi_konselor,
    file: image,
  };

  // LAUNCH EDIT
  const launchEdit = (id) => {
    const editId = getDataKonselor.filter((item) => item.id === id)[0];
    setShow(true);
    setId(id);
    setDataKonselor(editId);
    setModalFor('EDIT');
  };
  // LAUNCH ADD
  const launchAdd = () => {
    setShow(true);
    setModalFor('ADD');
  };
  // LAUNCH DELETE
  const launchDelete = (id, name_konselor) => {
    setKonfirmasi(`Are you sure to delete article '${name_konselor}'  ?`);
    setShowDelete(true);
    setId(id);
  };
  //LAUNCH DETAIL
  const launchDetail = (id) => {
    setShowDetail(true);
    setDataDetail(getDataKonselor.filter((item) => item.id === id)[0]);
  };

  let i = 1;

  const fetchKonselor = async (token) => {
    try {
      const res = await axios.get('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/konselor', {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header Authorization
        },
      });
      setGetDataKonselor(res.data.data);
    } catch (error) {}
  };
  // ADD KONSELOR
  const addKonselor = async (tokens, body) => {
    try {
      const res = await axios.post('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/konselor', body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };
  // DELETE KONSELING
  const deleteKonselor = async (tokens, id) => {
    try {
      const res = await axios.delete('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/konselor/' + id, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // EDIT KONSELING
  const editKonselor = async (tokens, id, body) => {
    try {
      const res = await axios.put('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/konselor/' + id, body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      console.log(res.data);
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };

  // HANDLE ADD KONSELORD
  const handleAddKonselor = async (e) => {
    e.preventDefault();
    const code = await addKonselor(tokens, body);
    setShow(false);
    setDataKonselor('');
    await fetchKonselor(tokens);
    if (code == 201) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // HANDLE DELETE KONSELING
  const handleDeleteKonselor = async (e) => {
    await deleteKonselor(tokens, id);
    setShowDelete(false);
    await fetchKonselor(tokens);
  };
  // HANDLE EDIT KONSELING
  const handleEditKonselor = async (e) => {
    e.preventDefault();
    const code = await editKonselor(tokens, id, body);
    setShow(false);
    setDataKonselor('');
    await fetchKonselor(tokens);
    if (code == 200) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchKonselor(token);
    setTokens(token);
  }, []);
  return (
    <>
      <LayoutsAdmin title="Konselors">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                KONSELORS <span className="badge bg-info">{getDataKonselor.length}</span>
              </h5>
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3 h-100">
            <div className="card-body content-list">
              <Button
                className="btn btn-primary ms-2 mt-2 mb-3"
                data-bs-toggle="modal"
                onClick={launchAdd}
              >
                Tambah +{' '}
              </Button>
              <div className="content-profile table-responsive m-2">
                {/* ALERT */}
                {alert ? (
                  <>
                    {alertFor == 'success' ? (
                      <>
                        <div
                          className="alert alert-success alert-dismissible fade show"
                          role="alert"
                        >
                          <strong>Sukses</strong> Data berhasil diproses!
                          <button
                            onClick={handleClose}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/*  */}
                      </>
                    ) : (
                      <>
                        <div
                          className="alert alert-danger alert-dismissible fade show"
                          role="alert"
                        >
                          <strong>Gagal</strong> Data tidak dapat diproses!
                          <button
                            onClick={handleClose}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {/* ALERT */}
                <br />
                <table className="table table-bordered border-primary">
                  <thead className="bg-info">
                    <tr>
                      <th>NO.</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>DESKRIPSI</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataKonselor.map((konselor) => (
                      <>
                        <tr>
                          <td>{i++}</td>
                          <td>
                            <div className="d-flex">
                              <div className="w-25 justify-content-center">
                                <center>
                                  {' '}
                                  <Image
                                    src={konselor.profile_konselor == null ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' : konselor.profile_konselor}
                                    alt="profil"
                                    width="50"
                                    className="rounded-circle"
                                    height="50"
                                  />
                                </center>
                              </div>
                              <div className="w-75">
                                <h5 className="fw-bold">{konselor.name_konselor}</h5>
                              </div>
                            </div>
                          </td>
                          <td>{konselor.email_konselor}</td>
                          <td>{konselor.deskripsi_konselor}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDetail(konselor.id)}
                              >
                                <Icon
                                  icon="icon-park-solid:eyes"
                                  width="20"
                                  height="20"
                                  style={{ color: ' #145bff' }}
                                />
                              </button>
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchEdit(konselor.id)}
                              >
                                <Icon
                                  width="20"
                                  height="20"
                                  icon="basil:edit-solid"
                                  style={{ color: ' #ffc014' }}
                                />
                              </button>
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDelete(konselor.id, konselor.name_konselor)}
                              >
                                <Icon
                                  icon="iconoir:trash-solid"
                                  width="20"
                                  height="20"
                                  style={{ color: '#c20027' }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                    {getDataKonselor.length < 1 ? (
                      <>
                        <tr>
                          <td colSpan={6}>
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

        {/* Modal ADD */}
        <Modal
          show={show}
          onHide={closeAdd}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalFor} KONSELOR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={modalFor == 'EDIT' ? handleEditKonselor : handleAddKonselor}>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Nama Konselor
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry Title"
                  name="name_konselor"
                  {...(modalFor == 'EDIT' ? { value: dataKonselor?.name_konselor } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Email Konselor
                </label>
                <input
                  type="email"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry Image"
                  name="email_konselor"
                  {...(modalFor == 'EDIT' ? { value: dataKonselor?.email_konselor } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Profile Konselor
                </label>
                <input
                  type="file"
                  className="form-control"
                  id=""
                  {...(modalFor == 'EDIT' ? '' : { require })}
                  aria-describedby=""
                  placeholder="Entry subTitle"
                  name="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Deskripsi Konselor
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry Konten"
                  {...(modalFor == 'EDIT' ? { value: dataKonselor?.deskripsi_konselor } : '')}
                  name="deskripsi_konselor"
                  onChange={onChangeInputValue}
                ></textarea>
              </div>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={closeAdd}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/* MODAL DELETE */}
        <Modal
          show={showDelete}
          onHide={closeDelete}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>DELETE KONSELOR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <h5 className="m-3 text-danger">{konfirmasi}</h5>
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
                onClick={handleDeleteKonselor}
                className="btn btn-primary"
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

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
            <Modal.Title>DETAIL KONSELOR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="m-3">
              <center>
                <Image
                  className="img-fluid pt-2"
                  src={dataDetail.profile_konselor}
                  alt="image"
                  width="300"
                  height="300"
                />
                <h5 className="pt-3 fw-bold">{dataDetail.name_konselor} </h5>
                <h6 className="pt-2">{dataDetail.email_konselor} </h6>
                <p className="text-justify">
                  <br />
                  {dataDetail.deskripsi_konselor}
                </p>
              </center>
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

export default Konselors;
