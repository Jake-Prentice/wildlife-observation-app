import * as firestore from "firebase/firestore"
import {addAnimal,getAnimal,processAnimalName,addAnimalName,upvoteAnimalName,downvoteAnimalName} from './observations'
import * as obsFunc from "./observations"
jest.spyOn(obsFunc,'uploadImages').mockReturnValue(Promise.resolve(["a","b","c"])) 
jest.mock("firebase/firestore", () => {
    return {
        getFirestore:()=>{5},
        addDoc: jest.fn() as jest.Mock<typeof firestore.addDoc>,
        doc:jest.fn() as jest.Mock<typeof firestore.doc>,
        collection:jest.fn() as jest.Mock<typeof firestore.collection>,
        setDoc:jest.fn() as jest.Mock<typeof firestore.setDoc>,
        query:jest.fn() as jest.Mock<typeof firestore.query>,
        where:jest.fn() as jest.Mock<typeof firestore.where>,
        getDocs:jest.fn() as jest.Mock<typeof firestore.getDocs>,
        updateDoc:jest.fn() as jest.Mock<typeof firestore.updateDoc>,
        arrayUnion:jest.fn() as jest.Mock<typeof firestore.arrayUnion>,
        getDoc:jest.fn() as jest.Mock<typeof firestore.getDoc>
    }
})

describe('addAnimal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    (firestore.addDoc as jest.Mock).mockImplementationOnce(()=>{});
    (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id"}});
    (firestore.collection as jest.Mock).mockImplementation(()=>{return "collection"});
    (firestore.setDoc as jest.Mock).mockImplementation(()=>{});
    it("should add animal and return id", async () => {
        await expect(addAnimal("animal")).resolves.toBe("id")

    })
})

describe('getAnimal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    (firestore.getDocs as jest.Mock).mockImplementation(()=>{return {docs:[{id:"id"},{id:"id2"}],empty:false}});
    (firestore.collection as jest.Mock).mockImplementation(()=>{return "collection"});
    (firestore.query as jest.Mock).mockImplementation(()=>{});
    (firestore.where as jest.Mock).mockImplementation(()=>{return "where"});
    it("should query and return id", async () => {
        await expect(getAnimal("animal")).resolves.toBe("id")

    })
    it("should return null without throwing error when no animals found", async () => {
        (firestore.getDocs as jest.Mock).mockImplementationOnce(()=>{return {docs:[],empty:true}});
        await expect(getAnimal("animal")).resolves.toBe(null)

    })
})


describe('processAnimalName', () => {
    let mockGetAnimal = jest.spyOn(obsFunc,'getAnimal')
    let mockAddAnimal = jest.spyOn(obsFunc,'addAnimal')
    afterAll(() => {
        jest.restoreAllMocks;
    })
    
    it("should query name with removed whitespace and in lowercase and return id", async () => {
        (mockGetAnimal as jest.Mock).mockResolvedValueOnce("idquery")
        await expect(processAnimalName("A N I m a l")).resolves.toBe("idquery")

    })
    
    it("should call add if animal name returns null", async () => {
        (mockGetAnimal as jest.Mock).mockResolvedValueOnce(null);
        (mockAddAnimal as jest.Mock).mockImplementation(()=>{return "id2";});
        const a = await processAnimalName("A N I m a l");
        expect(mockAddAnimal).toHaveBeenCalledWith("animal")

    })
    
})

describe('addAnimalName', () => {
    let mockProcessAnimalName = jest.spyOn(obsFunc,'processAnimalName');
    (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id"}});
    (firestore.updateDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
    (firestore.arrayUnion as jest.Mock).mockReturnValue("arrayUnion");
    afterAll(() => {
        jest.restoreAllMocks;
    })
    
    it("process name, call all the functions with correct values", async () => {
        (mockProcessAnimalName as jest.Mock).mockResolvedValueOnce("idquery");
        const a = await addAnimalName("id","A N I m a l");
        expect(firestore.updateDoc).toHaveBeenCalledWith({id:"id"},{animalName:"arrayUnion"});

    })
    
})

describe('upvoteAnimalName', () => {
    let fakeAnimal: { upvotes: number , refId:string};
    let fakeAnimal2;
    (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id"}});
    (firestore.getDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
    (firestore.arrayUnion as jest.Mock).mockReturnValue("arrayUnion");
    afterAll(() => {
        jest.restoreAllMocks;
    })
    beforeEach(() => {
        fakeAnimal = {refId:"id1",upvotes:1};
        fakeAnimal2 = {upvotes:1};
    })
    //Valid case
    it("upvotes animal", async () => {
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementationOnce(()=>{return {exists:()=>{return true;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
        const a = await upvoteAnimalName("obsId","id1")
        expect(firestore.updateDoc).toHaveBeenLastCalledWith({id:"id1"},{animalName:[{refId:"id1",upvotes:2}]});

    })
    //Error case
    it("throws when observation not found", async () => {
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementationOnce(()=>{return {exists:()=>{return false;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
        const a = await expect(upvoteAnimalName("obsId","id1")).rejects.toThrow();

    })
    //Behaviour check case - currently fails
    //TODO - fix
    it("can only upvote once per user ", async () => {
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementation(()=>{return {exists:()=>{return true;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation((a,b)=>{fakeAnimal.upvotes = b.animalName[0].upvotes; return Promise.resolve("")});
        await upvoteAnimalName("obsId","id1")
        await upvoteAnimalName("obsId","id1")
        expect(firestore.updateDoc).toHaveBeenLastCalledWith({id:"id1"},{animalName:[{refId:"id1",upvotes:2}]});

    })
    
})

describe('downvoteAnimalName', () => {
    let fakeAnimal: { upvotes: number , refId:string};
    let fakeAnimal2;
    (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id"}});
    (firestore.getDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
    (firestore.arrayUnion as jest.Mock).mockReturnValue("arrayUnion");
    afterAll(() => {
        jest.restoreAllMocks;
    })
    beforeEach(() => {
        fakeAnimal = {refId:"id1",upvotes:1};
        fakeAnimal2 = {upvotes:1};
    })
    
    it("downvotes animal", async () => {
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementationOnce(()=>{return {exists:()=>{return true;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
        const a = await downvoteAnimalName("obsId","id1")
        expect(firestore.updateDoc).toHaveBeenLastCalledWith({id:"id1"},{animalName:[{refId:"id1",upvotes:0}]});

    })

    it("does not downvote animal when at 0", async () => {
        fakeAnimal = {refId:"id1",upvotes:0};
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementationOnce(()=>{return {exists:()=>{return true;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation(()=>{return Promise.resolve("")});
        const a = await downvoteAnimalName("obsId","id1");
        expect(firestore.updateDoc).toHaveBeenLastCalledWith({id:"id1"},{animalName:[{refId:"id1",upvotes:0}]});

    })
    //Behaviour check case - currently fails
    //TODO - fix
    it("can only downvote once per user ", async () => {
        fakeAnimal.upvotes = 3;
        (firestore.doc as jest.Mock).mockImplementation(()=>{return {id:"id1"}});
        (firestore.getDoc as jest.Mock).mockImplementation(()=>{return {exists:()=>{return true;},data:()=>{return{animalName:[fakeAnimal]}}}});
        (firestore.updateDoc as jest.Mock).mockImplementation((a,b)=>{fakeAnimal.upvotes = b.animalName[0].upvotes; return Promise.resolve("")});
        await downvoteAnimalName("obsId","id1")
        await downvoteAnimalName("obsId","id1")
        expect(firestore.updateDoc).toHaveBeenLastCalledWith({id:"id1"},{animalName:[{refId:"id1",upvotes:2}]});

    })
    
})

