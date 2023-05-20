import React from 'react'
import {organizationDetails,P2PClouds} from "../Organization/details";

const Footer = () => {
  return (
    <footer className="footer  position-fixed bottom-0 w-100" >
    <div className="container text-center text-white ">
      <p className="mb-3">
        &copy; {new Date().getFullYear()} <a href={`https://${organizationDetails.website}`} className="text-white">
        {organizationDetails.name}
        </a>. Design and developed by{" "}
        <a href={`https://${P2PClouds.website}`} className="text-white">
          {P2PClouds.name}
        </a>
      </p>
    </div>
  </footer>
  
  )
}

export default Footer
