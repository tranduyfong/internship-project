import React from 'react';
import { Box } from '@mui/material';

interface HomeTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, borderBottom: '2px solid #f0f0f0' }}>
            {tabs.map((tab) => (
                <Box
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    sx={{
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontWeight: activeTab === tab ? 'bold' : 600,
                        fontSize: '0.85rem',
                        color: activeTab === tab ? '#000' : '#555',
                        backgroundColor: activeTab === tab ? '#ffb300' : 'transparent',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                >
                    {tab}
                </Box>
            ))}
        </Box>
    );
};

export default HomeTabs;