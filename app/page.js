'use client';

import Image from 'next/image';
import Logo from '../component/image/logo-image.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import process from 'process';

export default function Home() {
  return (
    <>
      <h1>HALAMAN UTAMA</h1>
    </>
  );
}
