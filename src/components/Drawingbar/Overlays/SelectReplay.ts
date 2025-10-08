import type { OverlayTemplate } from '@basttyy/klinecharts';
import { chartTimestamp, replayOverlay } from '../../../constants';

const SelectReplay: OverlayTemplate = {
    name: 'select_replay',
    totalStep: 2, // Two steps: start and end
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    zLevel: 99,
    styles: {
        polygon: {
            color: 'rgba(22, 119, 255, 0.15)'
        }
    },
    createPointFigures: ({ coordinates, bounding }) => {
        // Ensure bounding values are valid
        if (bounding.width === 0 || bounding.height === 0) {
            console.error('Invalid bounding box dimensions:', bounding);
            return [];
        }

        if (coordinates.length > 0 && coordinates[0]) {
            return [
                {
                    type: 'line',
                    attrs: {
                        coordinates: [
                            { x: coordinates[0].x, y: 0 },
                            { x: coordinates[0].x, y: bounding.height }
                        ]
                    },
                    styles: {
                        style: 'stroke',
                        color: 'rgba(22, 119, 255, 1)', // Solid blue line
                        width: 2
                    }
                },
                {
                    type: 'polygon',
                    attrs: {
                        coordinates: [
                            { x: bounding.left, y: 0 },
                            { x: coordinates[0].x, y: 0 },
                            { x: coordinates[0].x, y: bounding.height },
                            { x: bounding.left, y: bounding.height }
                        ]
                    },
                    styles: {
                        style: 'fill',
                        color: 'rgba(22, 119, 255, 0.15)'
                    }
                }
            ];
        }
        return [];
    },
    performEventMoveForDrawing: ({ points, performPoint }) => {
        if (points.length === 1) {
            points[0] = { ...performPoint };
        }
    },
    onDrawEnd: (event): boolean => {
        console.info('SelectReplay overlay drawing ended');
        console.info(event.overlay.points);
        if (!event.overlay.points[0] || !event.overlay.points[0].timestamp) {
            console.info('Returning due to invalid overlay point');
            return true;
        }

        chartTimestamp.value = event.overlay.points[0].timestamp;
        replayOverlay.value = event.overlay;
        return true;
    }
};

export default SelectReplay;