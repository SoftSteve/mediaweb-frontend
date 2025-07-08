import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpaceCard from './SpaceCard';
import { API_URL } from '../../config';

export default function SpacesPreview() {
    const navigate = useNavigate();

    const [eventSpace, setSpace] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        axios
            .get('https://memory-branch.com/api/eventspace/', { withCredentials: true })
            .then(res => {
            const items =
                Array.isArray(res.data) ? res.data : res.data.results ?? [];
            setSpace(items);
            })
            .catch(setError);
        }, []);

    return (
        <div className="flex flex-col gap-4">

            <div className="flex flex-col text-primary px-6 gap-2">
                <h1 className="text-2xl font-medium">Recent Spaces</h1>
                <p className="text-md font-lighter">Visit your most recently created spaces</p>
            </div>

            <div className="w-full overflow-x-auto px-6">
                <div className="flex gap-4 w-max">
                    {Array.isArray(eventSpace) &&
                        eventSpace.map(space => (
                            <SpaceCard
                            key={space.id}
                            image={space.cover_image}
                            title={space.name}
                            onClick={() => navigate(`/space/${space.id}`)}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}