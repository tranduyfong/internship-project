// src/container/Footer.tsx
import React from 'react';
import { FooterAbout, FooterSupport, FooterContact, FooterNewsletter } from './footer/FooterColumns';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-5 pb-4">
            <div className="container">
                <div className="row g-4">
                    <FooterAbout />
                    <FooterSupport />
                    <FooterContact />
                    <FooterNewsletter />
                </div>
            </div>
        </footer>
    );
};

export default Footer;