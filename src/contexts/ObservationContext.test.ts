import useCamera, { UseCamera } from '@/hooks/useCamera';
import {haversineDistance, getLocationInfo, getMostRecentTimestamp} from './ObservationContextIsolated';
import {expect, jest, test} from '@jest/globals';
describe('haversineDistance',()=>{
    it('should return a number', () => {
        expect(typeof haversineDistance(51,0,75,100)).toBe("number");
    })
    it('should return correct values', () => {
        expect(haversineDistance(51,0,75,100)).toBe(4864.616256903511);
    })
    
})

describe('getLocationInfo',()=>{
    it('should return a location', () => {
        expect(getLocationInfo([({current:{exif:{GPSLatitude:10,GPSLongitude:10}}} as unknown as UseCamera)])).
        toStrictEqual({latitude:10,longitude:10,radius:-1})
    })
    
})

const placeholderDate = new Date("01-01-2024");
describe('getMostRecentTimeStamp',()=>{
    it('should return a location', () => {
        expect(getMostRecentTimestamp([({current:{exif:{timestamp:placeholderDate }}} as unknown as UseCamera)])).toBeInstanceOf(Date)
    })
    
})


