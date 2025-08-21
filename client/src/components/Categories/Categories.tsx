import { CategoriesItem } from './CategoriesItem';
import { CategoriesProps } from '@/store/store.interface';

import './Categories.scss';

interface CategoriesDataProps {
  categories: CategoriesProps[];
}

export const Categories = ({ categories }: CategoriesDataProps) => {
  return (
    <div className="categories">
      {categories?.length > 0 && (
        <div className="categories--wrapper">
          {categories.map((category) => (
            <CategoriesItem category={category} key={category.id} />
          ))}
        </div>
      )}
    </div>
  );
};
