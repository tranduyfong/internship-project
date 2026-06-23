import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="grow container py-5">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;