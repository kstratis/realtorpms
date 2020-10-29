import React, { Suspense, useState, useEffect } from "react";
import { renderHTML } from '../../utilities/helpers';
import ModalPortalWrapper from './ModalPortalWrapper';
import Spinner from '../../datatables/Spinner';
import useTooltips from '../../hooks/useTooltips';
import ModalResourceWrapper from "./ModalResourceWrapper";

const AddRemoveFavLists = preloadableLazy(() => import('../AddRemoveFavLists'));
const AddRemoveShowings = preloadableLazy(() => import('../AddRemoveShowings'));
const AddRemovePartners = preloadableLazy(() => import('../AddRemovePartners'));

const components = {
  AddRemoveFavLists: AddRemoveFavLists,
  AddRemoveShowings: AddRemoveShowings,
  AddRemovePartners: AddRemovePartners
};

function preloadableLazy(dynamicImport) {
  let promise;
  function load() {
    if (!promise) {
      promise = dynamicImport();
    }
    return promise;
  }
  const Comp = React.lazy(load);
  Comp.preload = load;
  return Comp;
}

function ModalControlStrip(props) {
  const [componentResource, setComponentResource] = useState(null);
  const [componentProps, setComponentProps] = useState(null);
  const [componentsList, setComponentsList] = useState(() => {
    return props.entries.map((entry => entry.name ))
  });

  useTooltips();

  useEffect(() => {
    componentsList.forEach((componentName) => {
      components[componentName].preload();
    })
  }, [componentsList]);

  const openModal = name => {
    setComponentResource(components[name]);
    const data = props.entries.find((e) => {
      return e.name === name;
    });
    setComponentProps(data);
  };

  const hideModal = () =>{
    setComponentResource(null);
  }

  return (
    <>
      {props.entries.map((entry, index) => (
        <div key={index} className={index === 0 ? 'reactstrap-modal-button-right' : 'reactstrap-modal-button-x'}>
          <button
            key={index}
            className={`btn btn-secondary btn-${entry.button.size}`}
            // id={this.props.id}
            // outline={this.props.outline}
            data-toggle={'tooltip'}
            data-placement={'top'}
            title={entry.button.tooltip}
            onClick={e => openModal(entry.name)}>
            {renderHTML(entry.button.content, 'span')}
          </button>
        </div>
      ))}
      {componentResource ? (
        <ModalPortalWrapper>
          <div className="modal fade" id="appModal" role="dialog" aria-labelledby="appModalLabel" aria-hidden="true">
            <div className={`modal-dialog ${componentProps['modal']['size'] === 'md' ? '' : 'modal-' + componentProps['modal']['size']} modal-dialog-centered`} role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 id={componentProps['name']} className="modal-title">
                    {componentProps['modal']['title']}
                  </h5>
                  {componentProps['modal']['modalHeaderHelp'] ? (
                    <button
                      data-toggle="popover"
                      data-placement="auto"
                      data-trigger="hover"
                      data-content={componentProps['modal']['modalHeaderHelp']}
                      className={`btn btn-sm btn-outline-info`}>
                      <i className={`fas fa-info colored`} />
                    </button>
                  ) : null}
                </div>

                <div className={`modal-body modal-wrapper`}>
                  <Suspense fallback={<Spinner isLoading={true} />}>
                    <ModalResourceWrapper resource={componentResource} resourceProps={componentProps['modal']} hideModal={hideModal} />
                  </Suspense>
                </div>

                <div className="modal-footer modal-footer-border">
                  <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">
                    {componentProps['modal']['buttonCloseLabel']}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortalWrapper>
      ) : null}
    </>
  );
}

export default ModalControlStrip;
