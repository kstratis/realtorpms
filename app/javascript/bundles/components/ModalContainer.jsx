import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRemoveFavLists from './AddRemoveFavLists';
import StoreClientSearch from './StoreClientSearch';
import RetrieveClientSearch from './RetrieveClientSearch';
import AddRemoveShowings from './AddRemoveShowings';
import ViewShowings from './ViewShowings';
import AddRemovePartners from './AddRemovePartners';
import { renderHTML } from '../utilities/helpers';

const components = {
  StoreClientSearch: StoreClientSearch,
  RetrieveClientSearch: RetrieveClientSearch,
  AddRemoveFavLists: AddRemoveFavLists,
  AddRemoveShowings: AddRemoveShowings,
  ViewShowings: ViewShowings,
  AddRemovePartners: AddRemovePartners
};

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    const SpecificSearch = components[this.props.child];
    return (
      <>
        <Button
          outline={this.props.outline}
          data-toggle={this.props.title ? 'tooltip' : ''}
          data-placement={this.props.title ? 'top' : ''}
          title={this.props.title ? this.props.title : ''}
          className={this.props.fireButtonClassnames ? this.props.fireButtonClassnames : ''}
          disabled={this.props.buttonDisabled || false}
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
            {console.log(this.props.modalHelpPopover)}
            {this.props.modalHelpPopover ?
            <button
              data-toggle="popover"
              data-placement="auto"
              data-trigger="hover"
              data-content={this.props.modalHelpPopover}
              className={`btn btn-sm btn-icon ml-2 btn-outline-info`}>
              <i className={`fas fa-info colored`} />
            </button> : null }
          </ModalHeader>
          <ModalBody className={this.props.modalBodyClassNames ? this.props.modalBodyClassNames : ''}>
            <SpecificSearch {...this.props} />
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
