'use client';
import { AppProvider } from '@/context/AppContext';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Headers from './(main)/Headers/page';
// Importing global styles
import "./globals.css";


const Template = ({ children }) => {
    return (
        <div>
            <Toaster position='top-center' />
            <AppProvider>
                <Headers />
                {children}
            </AppProvider>
        </div>
    )
}

export default Template