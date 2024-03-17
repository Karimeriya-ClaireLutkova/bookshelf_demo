import React from 'react';
import { errorDownloadImage, listImages } from '../utils/constants';

export default function useImagesConverter() {
  const [list, setList] = React.useState([]);
  const [listNew, setListNew] = React.useState([]);

  const handleChangeConverter = () => {
    iterateArray(listImages);
  };
  /*Функция по созданию массива картинок в формате base64*/
  function iterateArray(array) {
    array.map((image, i) => createImages(image)); 
  }

  /*Функция обновления объекта картинки*/
  function createImages(item) {
    let promise = new Promise((resolve) => {
      let img = loadImage(item.image); 
      resolve(img);
    })
    promise.then((data) => {
      handleDataUrl(data).then(elem => {
        let image = {name: item.name, id: item.id, image: elem.src};
        listNew.push(image);
        return listNew;
      })
      .then(dataList => {
        setList(dataList);
        setListNew([]);
      })
    })
  }
  /* Функция для загрузки изображения */
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(img)
      };
      img.onerror = () => {
        reject(new Error(errorDownloadImage))
      }
    })
  }

  function handleDataUrl(item) {
    return new Promise((resolve) => {
      let url = getBase64Image(item); 
      resolve(url);
    }) 
  }
  
   /*Функция получени src в формате base64*/
  function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/jpeg");
    img.src = dataURL;
    return img;
  }

  const resetFormConverter = React.useCallback(
    (newList = []) => {
      setList(newList);
    },
    [setList]
  );

  return { handleChangeConverter, list, resetFormConverter };
};