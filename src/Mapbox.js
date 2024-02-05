import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Mapbox.css';
import river from './assets/river-path.json'
import well from './assets/well.json'
import cities from './assets/arab-cities-involved-in-uprising.json'

mapboxgl.accessToken = 'pk.eyJ1IjoiZXp6YXRxIiwiYSI6ImNsczZnaXZjbTFqbjMyaW9la2g0dGxrN28ifQ.jtuiQb9gDuPadHa8Z6R49Q';
mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    null,
    true // Lazy load the plugin
);
function Mapbox () {
    const mapContainerRef = useRef(null);
    const [long, setLong] = useState(34.8857854135293);
    const [lat, setLat] = useState(31.7649922256824);
    const [zoom, setZoom] = useState(10.7543083009908);

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/ezzatq/cls6bcy7p00km01ql3fv61pdx',
            center: [long, lat],
            zoom: zoom
        });
        // disable map rotation using right click + drag
        map.dragRotate.disable();

        // disable map rotation using touch rotation gesture
        map.touchZoomRotate.disableRotation();

        map.on('load', () => {
            map.on('move', () => {
                setLong(map.getCenter().lng);
                setLat(map.getCenter().lat);
                setZoom(map.getZoom());
            });

            // add sources
            map.addSource('river', {
                type: 'geojson',
                data: river
            });
            map.addSource('well', {
                type: 'geojson',
                data: well
            });
            map.addSource('cities', {
                'type': 'geojson',
                'data': cities
            });

            // Handle Well
            map.addLayer({
                id: 'well-fill',
                type: 'fill',
                source: 'well',
                paint: {
                    "fill-color": "#6e0000",
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.5
                    ]
                }
            })

            map.addLayer({
                id: 'well-outline',
                type: 'line',
                source: 'well',
                paint: {
                    "line-color": "#6e0000",
                    "line-width": 4
                }
            })

            map.on('click', 'well-fill', (e) => {
                console.log('clicked well: ', e);
                window.location.href ='https://facebook.com';
            });

            map.on('mousemove', 'well-fill', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                map.setFeatureState(
                    { source: 'well', id: 'well-fill' },
                    { hover: true }
                );
            });
            map.on('mouseleave', 'well-fill', (e) => {
                map.getCanvas().style.cursor = 'auto';
                map.setFeatureState(
                    { source: 'well', id: 'well-fill' },
                    { hover: false }
                );
            });

            // Handle River
            map.addLayer({
                id: 'river',
                type: 'line',
                source: 'river',
                paint: {
                    // "line-color": "#ff0000",
                    "line-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        "#ff0000",
                        "#181856"
                    ],
                    "line-width": 10
                }
            })

            const riverPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on('mouseenter', 'river', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                riverPopup
                    .setLngLat(e.lngLat)
                    .setHTML("<h2>This is a river from Jerusalem to the Sea</h2>")
                    .addTo(map);
                map.setFeatureState(
                    { source: 'river', id: 'river' },
                    { hover: true }
                );
            });
            map.on('mouseleave', 'river', (e) => {
                map.getCanvas().style.cursor = 'auto';
                riverPopup.remove();
                map.setFeatureState(
                    { source: 'river', id: 'river' },
                    { hover: false }
                );
            });
            map.on('click', 'river', (e) => {
                console.log('clicked river: ', e);
                window.location.href ='https://amazon.com';
            });



            // Handle Cities
            map.loadImage(
                '/home-icon.png',
                (error, image) => {
                    if (error) throw error;
                    map.addImage('custom-marker', image);

                    map.addLayer({
                        'id': 'cities',
                        'type': 'symbol',
                        'source': 'cities',
                        'layout': {
                            'icon-image': 'custom-marker',
                            'icon-anchor': 'bottom',
                            'icon-size': 0.05,
                            'icon-allow-overlap': true,
                            'text-field': ['get', 'Name_AR'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-anchor': 'top'
                        }
                    })

                    map.on('click', 'cities', (e) => {
                        console.log('clicked city: ', e);
                        window.location.href ='https://apple.com';
                    });
                    map.on('mouseenter', 'cities', (e) => {
                        map.getCanvas().style.cursor = 'pointer';
                    });
                    map.on('mouseleave', 'cities', (e) => {
                        map.getCanvas().style.cursor = 'auto';
                    });
                });
        });



        // Clean up on unmount
        return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className='map-container' ref={mapContainerRef} />
        </div>
    );
}

export default Mapbox;
