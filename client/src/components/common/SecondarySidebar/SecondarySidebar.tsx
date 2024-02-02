import React from "react";
import styles from "./SecondarySidebar.module.scss";
import List from "@/src/components/UI/List/List";
import Card from "@/src/components/UI/Card/Card";

const friendsList = [
  { content: "Friend 1" },
  { content: "Friend 2" },
  { content: "Friend 3" },
];

const roomsList = [
  { content: "Room 1" },
  { content: "Room 2" },
  { content: "Room 3" },
];

const SecondarySidebar = () => {
  return (
    <div className={styles.secondarySidebar}>
      <div>Profile</div>
      <Card>
        <h2>Friends</h2>
        <List items={friendsList} />
      </Card>
      <Card>
        <h2>Rooms history</h2>
        <List items={roomsList} />
      </Card>
    </div>
  );
};

export default SecondarySidebar;
