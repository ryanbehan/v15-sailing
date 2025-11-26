import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
});

const Mermaid = ({ chart }) => {
    const ref = useRef(null);
    const [svg, setSvg] = useState('');

    useEffect(() => {
        if (chart) {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            try {
                mermaid.render(id, chart).then(({ svg }) => {
                    setSvg(svg);
                });
            } catch (error) {
                console.error('Mermaid rendering error:', error);
            }
        }
    }, [chart]);

    return <div className="mermaid flex justify-center my-8" ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
