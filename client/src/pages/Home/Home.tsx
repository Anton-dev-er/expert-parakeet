"use client";
import React from "react";
import Hero from "@/src/components/pages/home/Hero/Hero";
import List from "@/src/components/UI/List/List";
import styles from "./Home.module.scss";


const Home = () => {


  return (
    <div className={styles.home}>
      <Hero />
    </div>
  );
};

export default Home;
