import { elementsContainer, elementsNoPlaces } from './constants.js'

    //###############//
   // Общие функции //
  //###############//

//если нет places(карточек), то показать текст "нет добавленных.."
export function checkNoPlaces() {
    const listItems = [...elementsContainer.querySelectorAll("li")];
    if ( !listItems || !listItems.length ) elementsNoPlaces.removeAttribute('hidden')
    else if ( listItems.length ) elementsNoPlaces.setAttribute('hidden',"true");
}