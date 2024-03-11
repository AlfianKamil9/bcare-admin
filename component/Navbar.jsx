import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import Logo from './image/logo-image.png';
import Link from 'next/link';

const Navbar = () => {
  return (
    <>
      <nav className="navbar fixed-top navbar-dark navbar-expand-lg bg-info">
        <div className="container-fluid">
          <Link
            className="navbar-brand fw-bold"
            href="/dashboard"
          >
            <Image
              style={{ height: '40px', width: '150px' }}
              alt="LOGO"
              src={Logo}
            />{' '}
            BCARE{' '}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
