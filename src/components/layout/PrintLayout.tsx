import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PrintLayout() {
  return (
    <div className="print-layout w-full bg-white text-black m-0 p-0">
      <Outlet />
    </div>
  );
}
