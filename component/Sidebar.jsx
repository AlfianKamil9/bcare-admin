import React from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;
  const logout = async () => {
    try {
      const token = Cookies.get('token');
      await axios.delete('http://34.101.42.219:5000/api/v1/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Cookies.remove('token');
      router.push('/');
    } catch (error) {
      console.log(error);
      router.back();
    }
  };
  return (
    <>
      <ul className="justify-content-center mt-3 p-1">
        <li className={pathname == '/dashboard' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/dashboard"
            className={pathname == '/dashboard' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Dashboard
          </Link>
        </li>
        <li className={pathname == '/orders' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/orders"
            className={pathname == '/orders' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Orders
          </Link>
        </li>
        <li className={pathname == '/categories' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/categories"
            className={pathname == '/categories' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Categories
          </Link>
        </li>
        <li className={pathname == '/artikels' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/artikels"
            className={pathname == '/artikels' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Artikels
          </Link>
        </li>
        <li className={pathname == '/videos' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/videos"
            className={pathname == '/videos' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Videos
          </Link>
        </li>
        <li className={pathname == '/konselings' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/konselings"
            className={pathname == '/konselings' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Konselings
          </Link>
        </li>
        <li className={pathname == '/konselors' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/konselors"
            className={pathname == '/konselors' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Konselors
          </Link>
        </li>
        <li className={pathname == '/users' ? 'p-2 rounded m-3 bg-light ' : 'p-2 rounded m-3'}>
          <Link
            href="/users"
            className={pathname == '/users' ? 'text-decoration-none text-dark' : 'text-decoration-none text-light'}
          >
            Users
          </Link>
        </li>
        <li className="p-2 bg-secondary rounded m-3 mt-5 ">
          <div
            className="text-light"
            style={{ cursor: 'pointer' }}
            onClick={() => logout()}
          >
            Logout
          </div>
        </li>
      </ul>
    </>
  );
};

export default Sidebar;
