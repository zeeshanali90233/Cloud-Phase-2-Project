import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import Head from "next/head";

const AdminLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <Head>
  <title>Admin Dashboard | Learning Management System - Teps PVT Ltd</title>
  <meta name="description" content="Manage and oversee the Teps PVT Ltd Learning Management System (LMS) as an administrator. Access and update user data, manage permissions, and customize system settings." />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/admin/dashboard`} />
  <meta property="og:title" content="Admin Dashboard | Learning Management System - Teps PVT Ltd" />
  <meta property="og:description" content="Manage and oversee the Teps PVT Ltd Learning Management System (LMS) as an administrator. Access and update user data, manage permissions, and customize system settings." />
  <meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/admin/dashboard`} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/favicon-16x16.png" />
  <meta name="twitter:title" content="Admin Dashboard | Learning Management System - Teps PVT Ltd" />
  <meta name="twitter:description" content="Manage and oversee the Teps PVT Ltd Learning Management System (LMS) as an administrator. Access and update user data, manage permissions, and customize system settings." />
  <meta name="twitter:image" content="/favicon-16x16.png" />
  <link rel="icon" href="/favicon-16x16.png" />
</Head>

      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        <aside
          className={`sidebarArea shadow bg-white ${
            !open ? "" : "showSidebar"
          }`}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} isSAdmin={false} isAdmin={true} isStaff={false} isStudent={false} isTeacher={false} />
        </aside> 
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} isSAdmin={false} isAdmin={true} isStaff={false} isStudent={false} isTeacher={false}/>

          {/********Middle Content**********/}
          <Container  className="p-4 wrapper" fluid>
            <div >{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
