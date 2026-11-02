import { memo } from 'react';

import type { IngredientDetailsUIProps } from './type';

import styles from './ingredient-details.module.css';

export const IngredientDetailsUI = memo(function IngredientDetailsUI({
  ingredientData,
}: IngredientDetailsUIProps): React.JSX.Element {
  const { name, image_large, calories, proteins, fat, carbohydrates } = ingredientData;

  return (
    <div className={styles.content}>
      <img alt="изображение ингредиента." src={image_large} />
      <h3
        className="text text_type_main-medium mt-2 mb-4"
        data-testid="ingrDetails-name"
      >
        {name}
      </h3>
      <ul className={`${styles.nutritional_values} text_type_main-default`}>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Калории, ккал</p>
          <p className={`text text_type_digits-default`} data-testid="ingrDetails-cal">
            {calories}
          </p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Белки, г</p>
          <p className={`text text_type_digits-default`} data-testid="ingrDetails-prot">
            {proteins}
          </p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Жиры, г</p>
          <p className={`text text_type_digits-default`} data-testid="ingrDetails-fat">
            {fat}
          </p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Углеводы, г</p>
          <p className={`text text_type_digits-default`} data-testid="ingrDetails-carb">
            {carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
});
