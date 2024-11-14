import React from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import StoreContextProvider from '../../context/StoreContext'; // Import the context provider
import AppDownload from '../../components/AppDownload/AppDownload'
const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <StoreContextProvider>  {/* Wrap the component tree */}
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload/>
    </StoreContextProvider>
  );
};

export default Home;
