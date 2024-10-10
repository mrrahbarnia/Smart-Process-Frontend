// @ts-expect-error package not have good type interface
import jalaali from 'jalaali-js';

export const calculateDays = (jalaliDate: string) => {
    // Calculate number of days from 1401/01/01 to now
    const [year, month, day] = jalaliDate.split("/").map(Number);
    const gregorianDate = jalaali.toGregorian(year, month, day);
    const convertedDate = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);
    const currentDate = new Date();
    const diffTime = Math.abs(convertedDate.getTime() - currentDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
};