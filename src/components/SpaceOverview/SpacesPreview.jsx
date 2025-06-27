import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpaceCard from './SpaceCard';

export default function SpacesPreview() {
    const navigate = useNavigate();

    const [eventSpace, setSpace] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get('https://softsteve.pythonanywhere.com/api/eventspace/', {
            withCredentials: true
        })
            .then(response => {
                setSpace(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    return (
        <div className="flex flex-col gap-4">

            <div className="flex flex-col text-primary px-6 gap-2">
                <h1 className="text-2xl font-medium">Recent Spaces</h1>
                <p className="text-md font-lighter">Visit your most recently created spaces</p>
            </div>

            <div className="w-full overflow-x-auto px-6">
                <div className="flex gap-4 w-max">
                    {eventSpace.map((space, index) => (
                        <SpaceCard key={index} image={space.cover_image} title={space.name} onClick={() => navigate(`/space/${space.id}`)}/>
                    ))}
                </div>
            </div>
        </div>
    );
}