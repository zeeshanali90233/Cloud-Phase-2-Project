import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import Head from "next/head";

const StaffLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
      <Head>
        <title>Staff Dashboard | Learning Management System - Teps PVT Ltd</title>
        <meta name="description" content="Access and manage your courses and assignments on the Teps PVT Ltd Learning Management System (LMS) as a staff member." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/staff/dashboard`} />
        <meta property="og:title" content="Staff Dashboard | Learning Management System - Teps PVT Ltd" />
        <meta property="og:description" content="Access and manage your courses and assignments on the Teps PVT Ltd Learning Management System (LMS) as a staff member." />
        <meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/staff/dashboard`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon-16x16.png" />
        <meta name="twitter:title" content="Staff Dashboard | Learning Management System - Teps PVT Ltd" />
        <meta name="twitter:description" content="Access and manage your courses and assignments on the Teps PVT Ltd Learning Management System (LMS) as a staff member." />
        <meta name="twitter:image" content="/favicon-16x16.png" />
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>
        {/******** Sidebar **********/}
        <aside
          className={`sidebarArea shadow bg-white ${
            !open ? "" : "showSidebar"
          }`}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} isSAdmin={false} isAdmin={false} isStaff={true} isStudent={false} isTeacher={false}/>
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} isSAdmin={false} isAdmin={false} isStaff={true} isStudent={false} isTeacher={false}/>

          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default StaffLayout;
