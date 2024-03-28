import { ObservationSchema } from '@/services/schemas'
import { IObservationsValue, haversineDistance, useObservations } from '../contexts/ObservationContext'
import {toMinutesSinceMidnight, getClosestObservation, autoFilterCriteria, CurrentAnimal} from './useSearchAndFilterIsolated'
import * as altFuncs from './useSearchAndFilterIsolated'
import {expect, jest, test} from '@jest/globals';

(useObservations as jest.Mock).mockReturnValue({location:{latitude:20,longitude:20},data:{animalName:{refId:"id",name:"animal"},timestamp:[12,34]}})
const mockObservations = {location:{latitude:20,longitude:20},data:{animalName:{refId:"id",name:"animal"},timestamp:[12,34]}};
jest.mock('../contexts/ObservationContext',()=> {
    return{
    haversineDistance:jest.fn() as jest.Mock,
    useObservations:jest.fn() as jest.Mock,
    }
})
describe('toMinutesSinceMidnight', () => {
    it("takes a date and returns a number", () => {
        expect(typeof toMinutesSinceMidnight(new Date(Date.now()))).toBe('number');
    })
})
describe('autoFilterCriteria', () => {
    it("takes a date and changes filter times with correct start and end dates", () => {
        let filter = jest.spyOn(altFuncs,'changeDateTimeFilter');
        const d = Date.now();
        //(useObservations as jest.Mock).mockReturnValueOnce({data:{animalName:{refId:"id"},timestamp:[12,34]}})
        autoFilterCriteria([{id:"id"} as unknown as CurrentAnimal],{data:[{animalName:[{refId:"id"}]}],timestamp:new Date(d)} as unknown as IObservationsValue)
        expect(filter).toHaveBeenCalledWith(expect.objectContaining({"startTime":new Date(d).setHours(0,0,0,0),"endTime":new Date(d).setHours(23,59,0,0)}))
    })
})

describe('getClosestObservation',() => {
    it("takes observations and returns the closest one", () => {
        (haversineDistance as jest.Mock).mockReturnValueOnce(100);
        const a = getClosestObservation({userLocation:{
            coords: {
                latitude: 1, longitude: 1,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: 0
        },animalName:"animal"})
        expect(a).toStrictEqual(expect.objectContaining({animalName:[{refId:'id',name:'animal'}]}))
    })
    it("return null on no observations", () => {
        (haversineDistance as jest.Mock).mockReturnValueOnce(100);
        expect(getClosestObservation({userLocation:{
            coords: {
                latitude: 1, longitude: 1,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: 0
        },animalName:"nonexistent"})).toBe(null);
    })
})