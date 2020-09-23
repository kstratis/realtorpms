import React, { Suspense } from 'react';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
const AddRemoveFavLists = React.lazy(() => import('./AddRemoveFavLists'));
const StoreClientSearch = React.lazy(() => import('./StoreClientSearch'));
const MassAssignProperties = React.lazy(() => import('./MassAssignProperties'));
const RetrieveClientSearch = React.lazy(() => import('./RetrieveClientSearch'));
const AddRemoveShowings = React.lazy(() => import('./AddRemoveShowings'));
const ViewShowings = React.lazy(() => import('./ViewShowings'));
const AddRemovePartners = React.lazy(() => import('./AddRemovePartners'));
import URLSearchParams from '@ungap/url-search-params';

const components = {
  MassAssignProperties: MassAssignProperties,
  StoreClientSearch: StoreClientSearch,
  RetrieveClientSearch: RetrieveClientSearch,
  AddRemoveFavLists: AddRemoveFavLists,
  AddRemoveShowings: AddRemoveShowings,
  ViewShowings: ViewShowings,
  AddRemovePartners: AddRemovePartners,
};

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(
      prevState => ({
        modal: !prevState.modal,
      }),
      () => {
        let searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.get('autoclick')) return;
        searchParams.delete('autoclick');
        let newUrlParams = searchParams.toString()
          ? `${window.location.pathname}?${searchParams.toString()}`
          : window.location.pathname;
        history.replaceState(null, '', newUrlParams);
      }
    );
  }

  render() {
    const SpecificSearch = components[this.props.child];
    return (
      <>
        <Button
          id={this.props.id}
          outline={this.props.outline}
          data-toggle={this.props.title ? 'tooltip' : ''}
          data-placement={this.props.title ? 'top' : ''}
          title={this.props.title ? this.props.title : ''}
          className={this.props.fireButtonClassnames ? this.props.fireButtonClassnames : ''}
          disabled={this.props.buttonDisabled}
          size={this.props.fireButtonBtnSize ? this.props.fireButtonBtnSize : 'sm'}
          color={this.props.fireButtonBtnType ? this.props.fireButtonBtnType : 'secondary'}
          onClick={this.toggle}>
          <div dangerouslySetInnerHTML={{ __html: this.props.fireButtonLabel }} />
        </Button>
        <Modal
          isOpen={this.state.modal}
          size={this.props.modalSize ? this.props.modalSize : 'md'}
          toggle={this.toggle}
          className={this.props.className}
          contentClassName={this.props.modalContentClassNames ? this.props.modalContentClassNames : ''}
          scrollable={this.props.scrollable}>
          <ModalHeader
            className={`${this.props.modalHeaderClassNames ? this.props.modalHeaderClassNames : ''}`}
            toggle={this.toggle}>
            <span className={'d-inline-block align-middle'}>{this.props.modalTitle}</span>
            {this.props.modalHelpPopover ? (
              <button
                data-toggle="popover"
                data-placement="auto"
                data-trigger="hover"
                data-content={this.props.modalHelpPopover}
                className={`btn btn-sm btn-icon ml-2 btn-outline-info`}>
                <i className={`fas fa-info colored`} />
              </button>
            ) : null}
          </ModalHeader>
          <ModalBody className={this.props.modalBodyClassNames ? this.props.modalBodyClassNames : ''}>
            <Suspense fallback={<div>Loading...</div>}>
              <SpecificSearch {...this.props} />
            </Suspense>
          </ModalBody>
          <ModalFooter className={this.props.modalFooterClassNames ? this.props.modalFooterClassNames : ''}>
            <Button color="secondary" onClick={this.toggle}>
              {this.props.buttonCloseLabel}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default ModalContainer;
