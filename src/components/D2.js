import React, { useEffect, useState } from 'react';
import pako from 'pako';

const D2 = ({ chart }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (chart) {
            try {
                const data = new TextEncoder().encode(chart);
                const compressed = pako.deflate(data, { level: 9 });
                const result = Buffer.from(compressed)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_');
                setImageUrl(`https://kroki.io/d2/svg/${result}`);
            } catch (error) {
                console.error('D2 rendering error:', error);
            }
        }
    }, [chart]);

    if (!imageUrl) return null;

    return (
        <div className="flex justify-center my-8">
            <img src={imageUrl} alt="D2 Diagram" />
        </div>
    );
};

export default D2;
