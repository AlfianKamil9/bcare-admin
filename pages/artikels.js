import React, { useEffect, useState } from 'react';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import { Icon } from '@iconify/react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Image from 'next/image';
import moment from 'moment';
import Cookies from 'js-cookie';

const Artikels = () => {
  // MODAL DELETE
  const [alert, setAlert] = useState(false);
  const handleClose = () => setAlert(false);
  const [alertFor, setAlertFor] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [image, setImage] = useState(null);
  const closeDelete = () => setShowDelete(false);
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const closeDetail = () => setShowDetail(false);
  const [dataDetail, setDataDetail] = useState({});
  //
  const [modalFor, setModalFor] = useState('');
  const [id, setId] = useState('');
  const [tokens, setTokens] = useState('');
  const [getArtikel, setGetArtikel] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [show, setShow] = useState(false);
  const closeAdd = () => setShow(false);
  const [dataArtikels, setDataArtikels] = useState({
    title: '',
    subTitle: '',
    content: '',
    categoryContentId: '',
    babyBluesCategoryId: '',
  });
  // set onChange for add
  const onChangeInputValue = (e) => {
    setDataArtikels((prevDev) => ({ ...prevDev, [e.target.name]: e.target.value }));
  };
  const body = {
    title: dataArtikels.title,
    subTitle: dataArtikels.subTitle,
    content: dataArtikels.content,
    categoryContentId: dataArtikels.categoryContentId,
    babyBluesCategoryId: dataArtikels.babyBluesCategoryId,
    file: image,
  };
  let i = 1;

  // launch modal delete
  const launchDelete = (id, title) => {
    setKonfirmasi(`Are you sure to delete article '${title}'  ?`);
    setShowDelete(true);
    setId(id);
  };
  // launchModalDetail
  const launchDetail = (id) => {
    setShowDetail(true);
    setDataDetail(getArtikel.filter((item) => item.id === id)[0]);
    //console.log('data detail:', dataDetail);
  };
  // launch add modal
  const launchAdd = () => {
    setShow(true);
    setModalFor('ADD');
  };
  //launch modal edit
  const launchEdit = (id) => {
    const editId = getArtikel.filter((item) => item.id === id)[0];
    setShow(true);
    console.log(editId);
    setId(id);
    setDataArtikels(editId);
    setModalFor('EDIT');
  };

  // FETCH CATEGORIES
  const fetchCategories = async (token) => {
    try {
      const res = await axios.get('https://pragmatic-aegis-417023.et.r.appspot.com/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // FETCH ARTIKELS
  const fetchArtikels = async (token) => {
    try {
      const res = await axios.get('https://pragmatic-aegis-417023.et.r.appspot.com/api/v1/artikel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetArtikel(res.data.data);
    } catch (error) {}
  };
  // DELETE ARTICLES
  const deleteArtikels = async (tokens, id) => {
    try {
      const res = await axios.delete('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/article/' + id, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  // ADD ARTIKELS
  const addArtikels = async (tokens, body) => {
    try {
      const res = await axios.post('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/article', body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };
  // EDIT ARTIKELS
  const editArtikels = async (tokens, id, body) => {
    try {
      const res = await axios.put('https://pragmatic-aegis-417023.et.r.appspot.com/api/admin-only/v1/article/' + id, body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };
  // HANDLE ADD ARTIKELS
  const handleAddArtikels = async (e) => {
    e.preventDefault();
    const code = await addArtikels(tokens, body);
    setShow(false);
    setDataArtikels('');
    await fetchArtikels(tokens);
    if (code == 201) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // HANDLE DELETE ARTIKELS
  const handleDeleteArtikels = async () => {
    await deleteArtikels(tokens, id);
    setShowDelete(false);
    await fetchArtikels(tokens);
  };
  // HANLDE EDIT ARTICLES
  const handleEditArtikels = async (e) => {
    e.preventDefault();
    const code = await editArtikels(tokens, id, body);
    setShow(false);
    setDataArtikels('');
    await fetchArtikels(tokens);
    if (code == 200) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchArtikels(token);
    fetchCategories(token);
    setTokens(token);
  }, []);

  return (
    <>
      <LayoutsAdmin title="Artikels">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                ARTIKELS <span className="badge bg-info"> {getArtikel.length}</span>
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
                  <thead
                    className="bg-info"
                    style={{ backgroundColor: '#4d6a9f' }}
                  >
                    <tr style={{ backgroundColor: '#4d6a9f' }}>
                      <th>NO.</th>
                      <th>JUDUL</th>
                      <th>THUMBNAIL</th>
                      <th>SUBTITLE</th>
                      <th>CREATED</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getArtikel.map((artikel) => (
                      <>
                        <tr>
                          <td>{i++}</td>
                          <td>{artikel.title}</td>
                          <td>
                            <Image
                              src={artikel.image}
                              alt="image"
                              width="100"
                              height="70"
                            />
                          </td>
                          <td>{artikel.subTitle}</td>
                          <td>{moment(artikel.updatedAt).format('D MMMM YYYY')}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDetail(artikel.id)}
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
                                onClick={() => launchEdit(artikel.id)}
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
                                onClick={() => launchDelete(artikel.id, artikel.title)}
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
                    {getArtikel.length < 1 ? (
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

        {/* Modal ADD & DELETE*/}
        <Modal
          show={show}
          onHide={closeAdd}
          size="lg"
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalFor} ARTIKEL</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={modalFor == 'EDIT' ? handleEditArtikels : handleAddArtikels}>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Title Artikel
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry Title"
                  name="title"
                  {...(modalFor == 'EDIT' ? { value: dataArtikels?.title } : '')}
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
                  Sub-Title Artikel
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  required
                  aria-describedby=""
                  placeholder="Entry subTitle"
                  name="subTitle"
                  {...(modalFor == 'EDIT' ? { value: dataArtikels?.subTitle } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Kategori Artikel
                </label>
                <select
                  name="categoryContentId"
                  onChange={onChangeInputValue}
                  required
                  className="form-select"
                  aria-label="Default select example"
                  {...(modalFor == 'EDIT' ? { value: dataArtikels?.categoryContentId } : '')}
                >
                  <option>Select Category</option>
                  {getCategory.map((categories) =>
                    modalFor == 'EDIT' ? (
                      <>
                        <option
                          {...(dataArtikels?.categoryContentId == categories.id ? { selected: true } : '')}
                          value={categories.id}
                        >
                          {categories.category_name}
                        </option>
                      </>
                    ) : (
                      <>
                        <option value={categories.id}>{categories.category_name}</option>
                      </>
                    )
                  )}
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
                  onChange={onChangeInputValue}
                  required
                  className="form-select"
                  aria-label="Default select example"
                  {...(modalFor == 'EDIT' ? { value: dataArtikels?.babyBluesCategoryId } : '')}
                >
                  <option>
                    <strong>Select Baby Blues Categories</strong>
                  </option>
                  {modalFor == 'EDIT' ? (
                    <>
                      <option
                        {...(dataArtikels?.babyBluesCategoryId == 1 ? { selected: true } : '')}
                        value="1"
                      >
                        Aman
                      </option>
                      <option
                        {...(dataArtikels?.babyBluesCategoryId == 2 ? { selected: true } : '')}
                        value="2"
                      >
                        Kemungkinan Depresi
                      </option>
                      <option
                        {...(dataArtikels?.babyBluesCategoryId == 3 ? { selected: true } : '')}
                        value="3"
                      >
                        Depresi Ringan
                      </option>
                      <option
                        {...(dataArtikels?.babyBluesCategoryId == 4 ? { selected: true } : '')}
                        value="4"
                      >
                        Depresi Berat
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="1">Aman</option>
                      <option value="2">Kemungkinan Depresi</option>
                      <option value="3">Depresi Ringan</option>
                      <option value="4">Depresi Berat</option>
                    </>
                  )}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Konten Artikel
                </label>
                <textarea
                  type="text"
                  required
                  className="form-control"
                  id=""
                  aria-describedby=""
                  placeholder="Entry Konten"
                  name="content"
                  {...(modalFor == 'EDIT' ? { value: dataArtikels?.content } : '')}
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
        {/*  */}

        {/* MODAL DELETE */}
        <Modal
          show={showDelete}
          onHide={closeDelete}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>DELETE ARTIKELS</Modal.Title>
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
                onClick={handleDeleteArtikels}
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
            <Modal.Title>DETAIL ARTIKEL</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="m-3">
              <center>
                <h4>{dataDetail.title} </h4>
                <h6 className="pt-2">{dataDetail.subTitle}</h6>
                <Image
                  className="img-fluid"
                  src={dataDetail.image}
                  alt="image"
                  width="500"
                  height="300"
                />
              </center>
              <h6 className="pt-2">Kategori : {dataDetail.category_content?.category_name}</h6>
              <p className="text-justify">{dataDetail.content}</p>
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

export default Artikels;
