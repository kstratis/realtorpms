import React from 'react';
import { priceFilterOptions, sizeFilterOptions, floorFilterOptions, categoryFilterOptions } from '../utilities/helpers';
import RenderEntry from './RenderEntry';
import useSearchParams from '../hooks/useSearchParams';

function RetrieveClientSearch({
  searchprefs,
  i18n,
  i18nPriceOptions,
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {

  const params = useSearchParams(searchprefs);

  return (
    <div className="favlist-container mt-3">
      <div className="d-flex justify-content-center mt-2">
        <i className="pr-icon md search" />
      </div>
      <div className={'favlist-body mt-2'}>
        <h3>{i18n.search_save_subtitle}</h3>
        <div className={'col-12'}>
          <table className="table table-striped">
            <tbody>
              {params.map((element, index) => {
                return (
                  <RenderEntry
                    key={index}
                    element={element}
                    index={index}
                    i18n={i18n}
                    i18nPriceOptions={priceFilterOptions(i18nPriceOptions)}
                    i18nSizeOptions={sizeFilterOptions(i18nSizeOptions)}
                    i18nFloorOptions={floorFilterOptions(i18nFloorOptions)}
                    i18nCategoryOptions={categoryFilterOptions(i18nCategoryOptions)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={'row my-2'} />
      </div>
    </div>
  );
}

export default RetrieveClientSearch;
