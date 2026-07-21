const BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    let token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
    token = token.replace(/['"]+/g, '');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const facilityMapService = {
    getMapData: async (zoom: number, minLat: number, maxLat: number, minLng: number, maxLng: number) => {
        const query = `zoom=${zoom}&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
        const res = await fetch(`${BASE_URL}/facilities/map?${query}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};