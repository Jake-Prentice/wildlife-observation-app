import { globals } from 'jest.config';
import { getImageBlob, uploadImage, uploadImages } from './observations';
import * as firebaseStorage from 'firebase/storage';
import {expect, jest, test} from '@jest/globals';
// Mock fetch globally
const mockFetch = jest.spyOn(global,'fetch');

mockFetch.mockImplementation((img : string | URL | any) => {
  if ( img == 'validImage.jpg') {
    return Promise.resolve(new Response(new Blob(['fakeImageData']), {status:200}))
  }  else if (img == 'invalidImage.jpg') {
    return Promise.resolve (new Response(null,{status:300}))
  } else {
    throw Error("Fetch error");
  }
})

const blobOptions = { type: 'image/jpeg', lastModified: Date.now() } as BlobOptions;

// Mock Firebase storage functions
jest.mock('firebase/storage', () => {
  return {
    getStorage: jest.fn() as jest.Mock<typeof firebaseStorage.getStorage>,
    ref: jest.fn() as jest.Mock<typeof firebaseStorage.ref>,
    uploadBytesResumable: jest.fn() as jest.Mock<typeof firebaseStorage.uploadBytesResumable>,
    getDownloadURL: jest.fn() as jest.Mock<typeof firebaseStorage.getDownloadURL>,
  }
});

//Image blob
describe('getImageBlob', () => {
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  
  //Valid case
  it('should return a Blob for a successful fetch', async () => {
    const imageBlob = await getImageBlob('validImage.jpg');
    expect(fetch).toHaveBeenCalledWith('validImage.jpg');
    expect(imageBlob).toBeInstanceOf(Blob);
  });
  
  //Invalid URL case
  it('should throw an error for invalid image', async () => {
    await expect(getImageBlob('invalidImage.jpg')).rejects.toThrow(
      'Network response was not ok for URL: invalidImage.jpg'
    );
  });
  
  //Error case
  it('should throw an error if fetch fails', async () => {
    await expect(getImageBlob('image.jpg')).rejects.toThrow('Fetch error');
  });
  
});

/*
  mock firebase funcs
  mock fetch
  call normally?
  */
//Upload image

describe('uploadImage',() => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //Mock firebase functions
  (firebaseStorage.ref as jest.Mock).mockReturnValue({});
  (firebaseStorage.getStorage as jest.Mock).mockReturnValue({});
  (firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValue({
    on:(a:any,func: any,error: any,comp: any) => {comp()},
    snapshot:{ref:"ref"}
  });
  (firebaseStorage.getDownloadURL as jest.Mock).mockReturnValue("URL");
  
  //Normal test
  it('should work on valid data', async () => {
    const downloadURL = await uploadImage({ uri: 'validImage.jpg', metadata: {} })
    expect(downloadURL).toEqual("URL")
    expect(fetch).toHaveBeenCalledWith('validImage.jpg');
    expect(firebaseStorage.uploadBytesResumable).toHaveBeenCalledWith({}, expect.any(Blob), expect.anything());
    expect(firebaseStorage.getDownloadURL).toHaveBeenCalledWith("ref");
  });
  //Invalid image uri
  it('should throw error when getImageBlob is invalid', async () => {
    await expect(uploadImage({ uri: 'invalidImage.jpg', metadata: {} })).rejects.toThrow();
    expect(fetch).toHaveBeenCalledWith('invalidImage.jpg');

  });
  //Invalid download URL
  it('should throw error when download URL is invalid', async () => {
    (firebaseStorage.getDownloadURL as jest.Mock).mockImplementationOnce(()=>{throw Error("URL not found")})
    await expect(uploadImage({ uri: 'validImage.jpg', metadata: {} })).rejects.toThrow();

  });
  //Uploading error
  it('should throw error if issue while uploading and error function is called', async () => {
    (firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
      on:(a:any,func: any,error: any,comp: any) => {console.log(">>");error(new Error("upload error"))}
    });
    await expect(uploadImage({ uri: 'validImage.jpg', metadata: {} })).rejects.toThrow();
  })
})

describe('uploadImages',() => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  (firebaseStorage.ref as jest.Mock).mockReturnValue({});
  (firebaseStorage.getStorage as jest.Mock).mockReturnValue({});
  (firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValue({
    on:(a:any,func: any,error: any,comp: any) => {comp()},
    snapshot:{ref:"ref"}
  });
  (firebaseStorage.getDownloadURL as jest.Mock).mockReturnValue("URL");
  
  it('should work', async () => {
    const downloadURL = await uploadImages([{ uri: 'validImage.jpg', metadata: {} },{ uri: 'validImage.jpg', metadata: {} },{ uri: 'validImage.jpg', metadata: {} }])
    expect(downloadURL).toEqual(["URL","URL","URL"])
    expect(fetch).toHaveBeenCalledWith('validImage.jpg');
    expect(fetch).toBeCalledTimes(3);
    expect(firebaseStorage.uploadBytesResumable).toHaveBeenCalledWith({}, expect.any(Blob), expect.anything());
    expect(firebaseStorage.getDownloadURL).toHaveBeenCalledWith("ref");
  });

  //Invalid image uri
  it('should throw error on invalid image', async () => {
    await expect(uploadImages([{ uri: 'validImage.jpg', metadata: {} },{ uri: 'invalidImage.jpg', metadata: {} },{ uri: 'validImage.jpg', metadata: {} }])).rejects.toThrow();
  });

  //Empty list
  it('should do nothing on empty list without throwing exceptions', async () => {
    expect(uploadImages([])).resolves.not.toThrow()
  });
})
