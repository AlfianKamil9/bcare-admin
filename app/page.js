'use client';

import Image from 'next/image';
import Logo from '../component/image/logo-image.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import process from 'process';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFalse, setIsFalse] = useState(false);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`http://34.101.42.219:5000/api/v1/login`, {
        email,
        password,
      });
      if (res.data.code == 200) {
        Cookies.set('token', res.data.token, {
          expires: 1,
          // secure: true, // Restrict to HTTPS connections
          // httpOnly: true,
        });

        window.location.href = '/dashboard';
      } else {
        setTimeout(() => {
          setIsFalse(true);
          setIsFalse(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const token = Cookies.get('token');
    if (token != undefined) {
      window.location.href = '/dashboard';
    }
  }, []);
  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: '100vh', width: '500vh' }}
      >
        <div className="row">
          <div
            className="col-md-12"
            style={{}}
          >
            <div
              className="card"
              style={{ width: '500px' }}
            >
              <div className="card-header text-center fw-bold">
                <h3 className="mt-3 fw-bold">LOGIN</h3>

                <Image
                  alt="logo"
                  src={Logo}
                  className="img-fluid"
                  width={150}
                />
              </div>
              <div className="card-body">
                {isFalse == true ? (
                  <>
                    <strong className="text-danger m-2">
                      <i>
                        <span>Periksa kembali akun anda!!!</span>
                      </i>
                    </strong>
                  </>
                ) : (
                  <></>
                )}
                <form onSubmit={handleLogin}>
                  <div className="form-group m-2">
                    <label
                      htmlFor="username"
                      className="mb-2 fw-bold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control border-3 p-3"
                      id="username"
                      name="email"
                      value={email}
                      placeholder="Masukkan email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group m-2 pt-4 mb-3">
                    <label
                      htmlFor="password"
                      className="mb-2 fw-bold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control border-3 p-3"
                      id="password"
                      name="password"
                      value={password}
                      placeholder="Masukkan password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <center className="row m-2">
                    <button
                      type="submit"
                      className="btn btn-primary justify-content-center mt-2 mb-3"
                    >
                      Login
                    </button>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
