import React, { Children } from 'react';
import Header from './_components/Header';

function DashboardLayout({ children }) {
  return (
    <div>
      <Header/>
      <main>{children}</main>
    </div>
  );
}

export default DashboardLayout;
