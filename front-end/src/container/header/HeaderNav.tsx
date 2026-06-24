import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderNavProps {
    links: { title: string; path: string }[];
}

const HeaderNav: React.FC<HeaderNavProps> = ({ links }) => {
    return (
        <nav className="d-none d-lg-flex gap-4">
            {links.map((link) => (
                <Link key={link.path} to={link.path} className="nav-link fw-bold text-dark">
                    {link.title}
                </Link>
            ))}
        </nav>
    );
};

export default HeaderNav;