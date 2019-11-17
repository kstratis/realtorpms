import React from 'react';
import { renderHTML } from '../utilities/helpers';

function RenderRow({ name, value, index }) {
  return (
    <tr key={index}>
      <td>{name}</td>
      <td>{value}</td>
    </tr>
  );
}

function ClientEntry({
  element,
  index,
  i18n,
  i18nCfieldOptions,
  i18nPriceOptions,
  i18nSizeOptions,
  i18nFloorOptions,
  i18nCategoryOptions
}) {
  return (
    <>
      {(() => {
        const objKey = Object.keys(element)[0];
        const objValue = Object.values(element)[0];
        // DEBUG
        // console.log(objKey, objValue);
        // console.log(i18nCfieldOptions);
        switch (true) {
          case ['pricemin', 'pricemax'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nPriceOptions[objValue]} index={index} />
            );
          case ['sizemin', 'sizemax'].includes(objKey):
            return (
              <RenderRow
                name={i18n.search_save_filters[objKey]}
                value={renderHTML(i18nSizeOptions[objValue])}
                index={index}
              />
            );
          case ['floorsmin', 'floorsmax'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nFloorOptions[objValue]} index={index} />
            );
          case ['category', 'subcategory'].includes(objKey):
            return (
              <RenderRow name={i18n.search_save_filters[objKey]} value={i18nCategoryOptions[objValue]} index={index} />
            );
          case ['purpose'].includes(objKey):
            return (
              <RenderRow
                name={i18n.search_save_filters[objKey]}
                value={i18n.search_save_filters[objValue]}
                index={index}
              />
            );
          case ['locations'].includes(objKey):
            const locationValue = objValue
              .split(',')
              .map(element => {
                return element.split(':')[1];
              })
              .join(', ');
            return <RenderRow name={i18n.search_save_filters[objKey]} value={locationValue} index={index} />;
          case ['roomsmin', 'roomsmax'].includes(objKey):
          case ['constructionmin', 'constructionmax'].includes(objKey):
            return <RenderRow name={i18n.search_save_filters[objKey]} value={objValue} index={index} />;
          case /^cfield_/.test(objKey):
            const normalizedName = objKey.split('_').slice(1).join('_');
            return <RenderRow name={i18nCfieldOptions[normalizedName]} value={objValue === '1' ? '✔' : objValue } index={index} />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default ClientEntry;