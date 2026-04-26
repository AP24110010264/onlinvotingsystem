import React, { useEffect, useState } from 'react'
import axios from 'axios'

const UseFetch = (api_url, options) => {
    const [apiData, setApiData] = useState();
    const [Loading, setLoading] = useState(false)
    useEffect(() => {
        let fetch = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                let { data } = await axios.get(api_url, { headers })
                setApiData(data)
                setLoading(false)
            } catch (error) {
                console.log(error.message);
                setLoading(false)
            }
        }
        fetch()
    }, [options])
    return { apiData, Loading }
}

export default UseFetch
