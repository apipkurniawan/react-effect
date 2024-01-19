import { useEffect, useRef, useState, useCallback } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';
import { AVAILABLE_PLACES } from './data.js';

// load the picked places, cara 1
const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storeIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // load the picked places, cara 2
  // useEffect(() => {
  //   const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  //   const storedPlaces = storeIds.map((id) =>
  //     AVAILABLE_PLACES.find((place) => place.id === id)
  //   );

  //   setPickedPlaces(storedPlaces);
  // });

  // load the places
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setIsOpenModal(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpenModal(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storeIds]));
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsOpenModal(false);

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={isOpenModal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title='Available Places'
          places={availablePlaces}
          fallbackText='Sorted processing...'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
