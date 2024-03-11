import React from 'react';
import { placeEditInfoBook, placeNameAddImageDropdown, close, listImages } from '../../utils/constants';
import useFormValidator from '../../hooks/useFormValidator';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

export default function EditProfilePopup({ currentBook, isOpen, onClose, onUpdateInfo }) {
  const imagesListStorage = localStorage.getItem("base64");
  const imagesNew = JSON.parse(imagesListStorage);
  const [name, setName] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageCurrent, setImageCurrent] = React.useState('');
  const { errors, isValidCurrent, handleChange, resetForm } = useFormValidator();
  const [isOpenDropdown, setOpenDropdown] = React.useState(false);
  const className = `popup popup__list-example ${isOpenDropdown? "popup_opened" : ""}`;
  const element = document.querySelector("#book-image");

  /* Внесение данных из карточки книги в поля при открыти */
  React.useEffect(() => {
    if (isOpen) {
      resetForm();
      setName(currentBook.name);
      setAuthor(currentBook.author);
      setImage(currentBook.image);
    };
  }, [isOpen, currentBook]);

  /* Отслеживание наличия картинок в локальном хранилище */
  React.useEffect(() => {
    const imagesListStorage = localStorage.getItem("base64");
    if(!imagesListStorage) {
      localStorage.setItem("base64", JSON.stringify(listImages));
    }
  }, [imagesListStorage]);

  /* Функция проверки вводимых данных через хук */
  function handleChangeInput(evt, isImageDropdown) {
    handleChange({event: evt, placeName: isImageDropdown ? placeNameAddImageDropdown : placeEditInfoBook, currentBook});
    if(evt.target.name === 'name') {
      setName(evt.target.value);
    } else if(evt.target.name === 'author') {
      setAuthor(evt.target.value);
    } else if(evt.target.name === 'image') {
      setImage(evt.target.value);
    }
  }

  /* Функция открытия popup для выбора картинки из локального хранилища */
  function handleClickDropdown() {
    setImageCurrent('');
    setOpenDropdown(true);
  }

  /* Функция отслеживания выбора картинки и проверки через хук */
  function handleChangeDropdown(evt) {
    setImageCurrent(evt.target.value);
    handleChange({event: evt, placeName: placeNameAddImageDropdown, checkImage: true});
  }

  /* Функция фиксации выбора и установки слушателя для последующей провеки через хук */
  function handleDropdown() {
    setImage(imageCurrent);
    const isImageDropdown = true;
    const event = new CustomEvent('change', {
      cancelable: true
    });
    let evt;
    if(imageCurrent !== '' && (imageCurrent !== currentBook.image)) {
      evt = {target: {name: element.name, value: imageCurrent, validationMessage: "", checkImage: true}};
      element.dispatchEvent(event);
    } else {
      setImage(currentBook.image);
      evt = {target: {name: element.name, value: currentBook.image, validationMessage: "", checkImage: true}};
    }
    element.addEventListener(
      'change', handleChangeInput(evt, isImageDropdown), false,
    );
    element.dispatchEvent(event);
    handleCloseDropdown();
  }

  /* Функция закрытия popup выбора картинки */
  function handleCloseDropdown() {
    setOpenDropdown(false);
    setImageCurrent('');
  }

  /* Функция отмены путем закрытия */
  function handleCancelDropdown() {
    const event = new CustomEvent('change', {
      cancelable: true
    });
    let evt;
    const isImageDropdown = true;
    evt = {target: {name: element.name, value: currentBook.image, validationMessage: "", checkImage: true}};
    element.addEventListener(
      'change', handleChangeInput(evt, isImageDropdown), false,
    );
    element.dispatchEvent(event);
    setImage(currentBook.image);
    handleCloseDropdown();
  }

  /* Функция отправки данных из формы */
  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateInfo({name: name, author: author, image: image, id: currentBook.id});
    resetForm();
  }

  return (
    <PopupWithForm id="2"
                   name="book-edit"
                   title="Редактирование книги"
                   isOpen={isOpen}
                   onClose={onClose}
                   onSubmit={handleSubmit}
                   buttonText={"Сохранить"}
                   isValid={isValidCurrent}>
      <div className="popup__field popup__field_book-edit">
        <div className={`popup__data-input ${errors.name ? "popup__data-input_error" : ""}`}>
          <input id="book-name-input" type="text" className="popup__input popup__input_type_card-name" name="name" value={name} onChange={handleChangeInput} placeholder="Название" required />
          <span className={`book-name-input-error popup__input-error ${errors.name ? "popup__input-error_active" : ""}`}>{errors.name}</span>
        </div>
        <div className={`popup__data-input ${errors.author ? "popup__data-input_error" : ""}`}>
          <input id="book-author" type="text" className="popup__input popup__input_type_card-name" name="author" value={author} onChange={handleChangeInput} placeholder="Автор" required />
          <span className={`book-author-error popup__input-error ${errors.author ? "popup__input-error_active" : ""}`}>{errors.author}</span>
        </div>
        <div className={`popup__data-input ${errors.image ? "popup__data-input_error" : ""}`}>
          <input id="book-image" type="text" className="popup__input popup__input_type_card-name" name="image" value={image} onChange={handleChangeInput} placeholder="Добавить картинку" required />
          <div className="popup-span-group">
            <span className={`book-image-error popup__input-error ${errors.image ? "popup__input-error_active" : ""}`}>{errors.image}</span>
            <button type="button" className="popup__button popup__button_image-new popup__button_image-new_edit" onClick={handleClickDropdown}></button>
          </div>
            {isOpenDropdown ?
              (<div className={className}>
                <div className="popup__container popup__container_image-dropdown">
                <button type="button" onClick={handleCancelDropdown} className="popup__button popup__button_close popup__button_close_image-dropdown" aria-label={close + "image-dropdown"} />
                  <ul className="popup__list">
                    {imagesListStorage ? imagesNew.map((image, i) =>
                      <li key={"li-" + i} className="popup__list-element">
                        <label key={"label-edit" + i} htmlFor={image.id + "-image"}><img key={image.id + "edit-img"} className="popup__image" src={image.image} alt={image.name} /></label>
                        <input key={"inpt" + i} className="popup__input popup__input_type_image-dropdown" type="radio" id={image.id + "-image"} value={image.image} name="image" onChange={handleChangeDropdown} />
                      </li>
                    ) : listImages.map((image, i) =>
                      <li key={"list-" + i}className="popup__list-element">
                        <label key={"edit-label" + i} htmlFor={image.id + "-img"}><img key={image.name + image.id} className="popup__image" src={image.image} alt={image.name} /></label>
                        <input key={i + "inpt"} className="popup__input popup__input_type_image-dropdown" type="radio" id={image.id + "-img"} value={image.image} name="image" onChange={handleChangeDropdown} />
                      </li>)
                    }
                  </ul>
                  <button type="button" className="popup__button popup__button_image-dropdown" onClick={handleDropdown}>Добавить</button>
                </div>
              </div>
              ) : ''
            }
        </div>
      </div>
    </PopupWithForm>
  )
}