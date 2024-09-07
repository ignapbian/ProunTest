import axios from 'axios';

export const getListItems = async () => {
  try {
    const response = await axios.get('https://cityme-services.prepro.site/app_dev.php/api/districts/2');
    return JSON.stringify(response.data);
  } catch (error) {
    console.error('Error fetching list items:', error);
    throw error;
  }
}

export const getListItemsById = async (id: string) => {
    try {
        const response = await axios.get('https://cityme-services.prepro.site/app_dev.php/api/districts/2');
        const district = response.data.find((d: any) => d.id === id);
        if (district) {
          return JSON.stringify(district.pois);
        } else {
          throw new Error(`District with id ${id} not found`);
        }
      } catch (error) {
        console.error(`Error fetching items for district ${id}:`, error);
        throw error;
      }
}