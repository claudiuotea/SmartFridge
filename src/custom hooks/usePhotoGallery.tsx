import { useCamera } from '@ionic/react-hooks/camera';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory } from '@capacitor/core';
import { useEffect, useState } from 'react';
import { base64FromPath, useFilesystem } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';

//ca sa putem retine o poza
export interface Photo {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const { getPhoto } = useCamera();
  //array initial de poze
  const [photos, setPhotos] = useState<Photo[]>([]);

  const takePhoto = async () => {
    const cameraPhoto = await getPhoto({
       //ce vrem sa primim ca si result
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
   
    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));
  };

  const { deleteFile, readFile, writeFile } = useFilesystem();
  //salveaza poza in sistemul de fisiere [storage local]
  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => { 
     //codificarea datelor pt a putea face writeFile
     //materializeaza poza
    const base64Data = await base64FromPath(photo.webPath!);
    await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  };

  //definite de framework
  const { get, set } = useStorage();
  useEffect(() => {
     //se executa de fiecare data cand incarc aplicatia.
    const loadSaved = async () => {
       //preiau din storage toate denumirile de poze
      const photosString = await get(PHOTO_STORAGE);
      const photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
      //incarc toate pozele pe rand
      for (let photo of photos) {
        const file = await readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setPhotos(photos);
    };
    loadSaved();
  }, [get, readFile]);

  
  const deletePhoto = async (photo: Photo) => {
   //se filtreaza poza care are path-ul pe care vrem sa-l stergem 
   const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
   //se seteaza in storage un array de poze care nu contine poza stearsa
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    //se sterge si din sistemul de fisiere
    await deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
    setPhotos(newPhotos);
  };

  return {
    photos,
    takePhoto,
    deletePhoto,
  };
}