import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (axiosParams) => {
    const [response, setResponse] = useState(undefined);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async (params) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const result = await axios.request({
                ...params,
                headers: {
                    ...params.headers,
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setResponse(result.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(axiosParams);
    }, []); // Empty array ensures that effect is only run on mount

    return { response, error, loading };
};

export default useApi;
