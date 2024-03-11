import React, { useEffect, useState } from 'react';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import { Icon } from '@iconify/react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
const Konselings = () => {
  const [alert, setAlert] = useState(false);
  const handleClose = () => setAlert(false);
  const [alertFor, setAlertFor] = useState('');

  const [getKonseling, setGetKonseling] = useState([]);
  const [getKonselor, setGetKonselor] = useState([]);
  const [modalFor, setModalFor] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  let i = 1;
  const [image, setImage] = useState(null);
  const [id, setId] = useState('');
  const [tokens, setTokens] = useState('');
  const closeDetail = () => setShowDetail(false);
  const [dataDetail, setDataDetail] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const closeDelete = () => setShowDelete(false);
  const [konfirmasi, setKonfirmasi] = useState('');
  const [show, setShow] = useState(false);
  const closeAdd = () => setShow(false);
  const [dataKonseling, setDataKonseling] = useState({
    title_konseling: '',
    deskripsi_konseling: '',
    harga_konseling: '',
    konselorId: '',
    babyBluesCategoryId: '',
  });
  const onChangeInputValue = (e) => {
    setDataKonseling((prevDev) => ({ ...prevDev, [e.target.name]: e.target.value }));
  };
  const body = {
    title_konseling: dataKonseling.title_konseling,
    deskripsi_konseling: dataKonseling.deskripsi_konseling,
    harga_konseling: dataKonseling.harga_konseling,
    konselorId: dataKonseling.konselorId,
    babyBluesCategoryId: dataKonseling.babyBluesCategoryId,
    file: image,
  };

  //launch modal edit
  const launchEdit = (id) => {
    const editId = getKonseling.filter((item) => item.id === id)[0];
    setShow(true);
    setId(id);
    setDataKonseling(editId);
    setModalFor('EDIT');
  };
  // LAUNCH ADD
  const launchAdd = () => {
    setShow(true);
    setModalFor('ADD');
  };
  // LAUNCH DELETE
  const launchDelete = (id, title_konseling) => {
    setKonfirmasi(`Are you sure to delete article '${title_konseling}'  ?`);
    setShowDelete(true);
    setId(id);
  };
  //LAUNCH DETAIL
  const launchDetail = (id) => {
    setShowDetail(true);
    setDataDetail(getKonseling.filter((item) => item.id === id)[0]);
    console.log('data detail:', dataDetail);
  };

  // FETCH KONSELOR
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
  // FETCH KONSELING
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
  // ADD KONSELING
  const addKonseling = async (tokens, body) => {
    try {
      const res = await axios.post('http://34.101.42.219:5000/api/admin-only/v1/konseling', body, {
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
  const deleteKonseling = async (tokens, id) => {
    try {
      const res = await axios.delete('http://34.101.42.219:5000/api/admin-only/v1/konseling/' + id, {
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
  const editKonseling = async (tokens, id, body) => {
    try {
      const res = await axios.put('http://34.101.42.219:5000/api/admin-only/v1/konseling/' + id, body, {
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

  // HANDLE ADD KONSELING
  const handleAddKonseling = async (e) => {
    e.preventDefault();
    const code = await addKonseling(tokens, body);
    setShow(false);
    setDataKonseling('');
    await fetchKonseling(tokens);
    if (code == 201) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // HANDLE DELETE KONSELING
  const handleDeleteKonseling = async (e) => {
    await deleteKonseling(tokens, id);
    setShowDelete(false);
    await fetchKonseling(tokens);
  };
  // HANDLE EDIT KONSELING
  const handleEditKonseling = async (e) => {
    e.preventDefault();
    const code = await editKonseling(tokens, id, body);
    setShow(false);
    setDataKonseling('');
    await fetchKonseling(tokens);
    console.log('vote : ', code);
    if (code == 200) {
      setAlertFor('success');
      console.log(code);
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchKonseling(token);
    fetchKonselor(token);
    setTokens(token);
  }, []);
  return (
    <>
      <LayoutsAdmin title="Konselings">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                KONSELINGS <span className="badge bg-info"> {getKonseling.length}</span>
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
                      <th>LAYANAN</th>
                      <th>THUMBNAIL</th>
                      <th>KONSELOR</th>
                      <th>HARGA</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getKonseling.map((konseling) => (
                      <>
                        <tr>
                          <td>{i++}</td>
                          <td>{konseling.title_konseling}</td>
                          <td>
                            <center>
                              <Image
                                src={konseling.image_konseling}
                                alt="image"
                                width="100"
                                height="70"
                              />
                            </center>
                          </td>
                          <td>{konseling.konselor.name_konselor}</td>
                          <td>Rp. {konseling.harga_konseling}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDetail(konseling.id)}
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
                                onClick={() => launchEdit(konseling.id)}
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
                                onClick={() => launchDelete(konseling.id, konseling.title_konseling)}
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
                    {getKonseling.length < 1 ? (
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
            <Modal.Title>{modalFor} KONSELING</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={modalFor == 'EDIT' ? handleEditKonseling : handleAddKonseling}>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Title Konseling
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry Title"
                  name="title_konseling"
                  {...(modalFor == 'EDIT' ? { value: dataKonseling?.title_konseling } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Thumbanail
                </label>
                <input
                  type="file"
                  className="form-control"
                  id=""
                  {...(modalFor == 'EDIT' ? '' : { require })}
                  aria-describedby=""
                  placeholder="Entry Image"
                  name="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Harga Konseling
                </label>
                <input
                  type="number"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry subTitle"
                  name="harga_konseling"
                  {...(modalFor == 'EDIT' ? { value: dataKonseling?.harga_konseling } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Konselor Konseling
                </label>
                <select
                  name="konselorId"
                  className="form-select"
                  required
                  aria-label="Default select example"
                  onChange={onChangeInputValue}
                  {...(modalFor == 'EDIT' ? { value: dataKonseling?.konselorId } : '')}
                >
                  <option selected>PILIH KONSELOR</option>
                  {getKonselor.map((konselor) => (
                    <>
                      <option value={konselor.id}>{konselor.name_konselor}</option>
                    </>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Kategori Baby Blues
                </label>
                <select
                  name="babyBluesCategoryId"
                  required
                  className="form-select"
                  aria-label="Default select example"
                  {...(modalFor == 'EDIT' ? { value: dataKonseling?.babyBluesCategoryId } : '')}
                  onChange={onChangeInputValue}
                >
                  <option selected>PILIH KATEGORI BABY BLUES</option>
                  <option value="1">Aman</option>
                  <option value="2">Kemungkinan Depresi</option>
                  <option value="3">Depresi Ringan</option>
                  <option value="4">Depresi Berat</option>
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Deskripsi Konseling
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  required
                  id=""
                  aria-describedby=""
                  placeholder="Entry Konten"
                  name="deskripsi_konseling"
                  {...(modalFor == 'EDIT' ? { value: dataKonseling?.deskripsi_konseling } : '')}
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
            <Modal.Title>DELETE KONSELING</Modal.Title>
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
                onClick={handleDeleteKonseling}
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
            <Modal.Title>DETAIL KONSELING</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="m-3">
              <h4> LAYANAN KONSELING : {dataDetail.title_konseling} </h4>
              <Image
                className="img-fluid pt-2"
                src={dataDetail.image_konseling}
                alt="image"
                width="500"
                height="300"
              />

              <h6 className="pt-2">HARGA KONSELING : Rp. {dataDetail.harga_konseling} </h6>
              <h6 className="pt-2">KONSELOR KONSELING : {dataDetail.konselor?.name_konselor} </h6>
              <p className="text-justify">
                DESKRIPSI KONSELING :
                <br />
                {dataDetail.deskripsi_konseling}
              </p>
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

export default Konselings;
