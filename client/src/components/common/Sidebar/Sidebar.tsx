import React from "react";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faHome, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import List from "@/src/components/UI/List/List";
import Image from "next/image";
import Logo from "@/public/logo-2.png";

const list = [
  {
    content: "Home",
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faHome} />,
  },
  {
    content: "My Friends",
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faUserGroup} />,
  },
  {
    content: "My Rooms",
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faFilm} />,
  },
];

const list2 = [
  { content: "Account" },
  { content: "Settings" },
  { content: "History" },
];

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper}>
        <div>
          <div className={styles.logo}>
            <Image src={Logo} alt="logo" />
          </div>
          <div>
            <List items={list} />
          </div>
        </div>

        <div>Logout</div>
      </div>
    </div>
  );
};

export default Sidebar;
