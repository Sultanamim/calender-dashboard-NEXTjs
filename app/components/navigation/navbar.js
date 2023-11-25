"use client";
import React, { useState } from "react";
import "./navbar.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndustry,
  faCalendarDays,
  faGear,
  faFolder,
  faGrip,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";

export default function navbar() {
  const [active, setActive] = useState(false);
  const pathname = usePathname();

  return (
    <div className="nav-bar">
      <img src="/Logo.png" className="logo" alt="logo" />
      <div className="navlist w-100">
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <FontAwesomeIcon icon={faIndustry} />
            <Link href="/">Dashboard</Link>
          </li>
          <li className={pathname === "" ? "active" : ""}>
            <FontAwesomeIcon icon={faGrip} />
            <Link href="#">Invenhrefry</Link>
          </li>
          <li className={pathname === "" ? "active" : ""}>
            <FontAwesomeIcon icon={faAddressCard} />
            <Link href="#">Risk Register</Link>
          </li>
          <li className={pathname === "/calender" ? "active" : ""}>
            <FontAwesomeIcon icon={faCalendarDays} />
            <Link href="/calender">Calender</Link>
          </li>
          <li className={pathname === "/settings" ? "active" : ""}>
            <FontAwesomeIcon icon={faGear} />
            <Link href="/settings">Settings</Link>
          </li>
          <li className={pathname === "" ? "active" : ""}>
            <FontAwesomeIcon icon={faFolder} />
            <Link href="#">Documents</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
