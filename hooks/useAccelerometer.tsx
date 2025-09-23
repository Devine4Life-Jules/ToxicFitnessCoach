import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export type Coordinates = { x: number; y: number; z: number};

export function useAccelerometer(interval: number = 1000) {
    const [data, setData] = useState<Coordinates>({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        Accelerometer.setUpdateInterval(interval);
        const subscription = Accelerometer.addListener(setData);
        return () => subscription.remove();
    }, [interval]);
     return data;
}