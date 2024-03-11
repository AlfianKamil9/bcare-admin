import React from 'react';
import Navbar from '@/component/Navbar';
import Sidebar from '@/component/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './image/logo-image.png';
import Head from 'next/head';

export const metadata = {
  title: 'LOGIN | ADMIN WEB BCARE',
  description: 'Generated by create next app',
};

const LayoutsAdmin = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} | ADMIN BCARE</title>
        <link
          rel="icon"
          href="/logo-image.png"
          sizes="16x32"
          type="image/png"
        />
      </Head>

      <React.Fragment>
        <div
          className="d-flex flex-column justify-content-between"
          style={{ height: '100vh' }}
        >
          <Navbar />
          {/* tst */}

          <div className="body-main h-100 mt-3">
            <div className="row g-0 h-100">
              <div
                className="sidebar col-lg-2 mt-4 bg-dark collapse d-lg-block"
                // style={{ overflowY: 'scroll' }}
              >
                <div className="pt-3">
                  <Sidebar />
                </div>
              </div>
              <div className=" wrapper content content col-lg-10 mt-3">
                <div className="content-wrapper mt-5 h-50">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
};

export default LayoutsAdmin;
