import {
  ingredientSelector,
  isIngredientLoadingSelector,
} from '@/services/ingridientSlice';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useSelector(ingredientSelector);
  const isLoading = useSelector(isIngredientLoadingSelector);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
