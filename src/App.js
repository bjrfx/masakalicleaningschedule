import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import WeeklyCleaningData from './pages/WeeklyCleaningData';
import DailyCheckList from './pages/DailyCheckListForm';
import DailyCheckListData from './pages/DailyCheckListData';
import NavigationBar from './components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import WeeklyCleaningForm from './pages/WeeklyCleaningForm';
import './App.css'; // Make sure to import the CSS file
import Task from './components/task/Task';
import TestMail from './components/Test/TestMail';
const Layout = ({ toggleTheme, theme }) => (
  <div>
    <NavigationBar toggleTheme={toggleTheme} theme={theme} />
    <Outlet />
  </div>
);

const App = () => {


  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/weeklyCleaningData" element={<WeeklyCleaningData />} />
        <Route path="/weeklyCleaningForm" element={<WeeklyCleaningForm />} />
        <Route path="/dailyCheckList" element={<DailyCheckList />} />
        <Route path="/dailyCheckListData" element={<DailyCheckListData />} />
        <Route path="/assignTask" element={<Task />} />
        <Route path="/testMail" element={<TestMail />} />
      </Route>
    </Routes>
  );
};

export default App;