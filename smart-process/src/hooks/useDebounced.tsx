"use client"
import { useEffect, useState } from "react";


const useDebounced = (
    value: string,
    delay: number = 500
) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        };
    }, [value, delay])

    return debouncedValue
};

export default useDebounced;
