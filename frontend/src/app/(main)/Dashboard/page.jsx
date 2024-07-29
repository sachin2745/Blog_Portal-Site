"use client";
import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/login/success`, { withCredentials: true });
      console.log("response", response);
    } catch (error) {
      router.push("*");
    }
  }, [router]); // Use `router` instead of `navigate`

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
