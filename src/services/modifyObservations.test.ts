import { getObservations, addObservation} from './modifyObservationsIsolated';
import * as obs from './observations';
import * as firebaseFirestore from 'firebase/firestore';
import {expect, jest, test} from '@jest/globals';
import { ObservationToUpload } from '@/contexts/ObservationContext';

// Mock Firebase storage functions
const mockUploadImages = jest.spyOn(obs,'uploadImages').mockImplementation(()=>{return Promise.resolve(["a","b","c"]);})

jest.mock('firebase/firestore', () => {
  return {
    getFirestore:()=>{5},
    getDocs: jest.fn() as jest.Mock<typeof firebaseFirestore.getDocs>,
    addDoc: jest.fn() as jest.Mock<typeof firebaseFirestore.addDoc>,
    db: 5,
    collection:()=>{return "fakeCollection";}
  }
});
const fakeQuerySnapshot = {docs:[{data:()=>"a"},{data:()=>"b"},{data:()=>"c"}]};
describe('getObservations',() => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    //Mock firebase functions
    (firebaseFirestore.getDocs as jest.Mock).mockReturnValueOnce(fakeQuerySnapshot);
    
    //Normal test
    it('should work', async () => {
      const observations = await getObservations();
      expect(observations).toEqual(["a","b","c"])
    });
    //Empty list from getDocs()
    it("should throw error when given empty list", async () => {
        (firebaseFirestore.getDocs as jest.Mock).mockReturnValueOnce([]);
        await expect(getObservations()).rejects.toThrow();
    })
  })
describe('addObservations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    (firebaseFirestore.addDoc as jest.Mock).mockImplementationOnce(()=>{});
    //Regular case
    it("should work", async () => {
        const a = await addObservation({images:[{uri:"validImage.jpg"}]} as unknown as ObservationToUpload);
        expect(firebaseFirestore.addDoc).toBeCalledWith("fakeCollection",expect.objectContaining({images:['a','b','c']}))
        expect(a).toStrictEqual(expect.objectContaining({images:['a','b','c']}))
    })
    //invalidImage
    it("should throw error on invalid image", async () => {
      mockUploadImages.mockImplementationOnce(()=>{throw Error("invalid image");})
      await expect(addObservation({images:[{uri:"invalidImage.jpg"}]} as unknown as ObservationToUpload)).rejects.toThrow();
  })
})
  