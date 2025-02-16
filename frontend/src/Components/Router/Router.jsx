import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/site/HomePage";
import SignIn from "../pages/userAuth/SignIn";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
};

export default Router;
