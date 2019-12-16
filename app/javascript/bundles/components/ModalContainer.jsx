import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRemoveFavLists from './AddRemoveFavLists';
import StoreClientSearch from './StoreClientSearch';
import RetrieveClientSearch from './RetrieveClientSearch';
import SimpleTableView from './SimpleTableView';

const components = {
  StoreClientSearch: StoreClientSearch,
  RetrieveClientSearch: RetrieveClientSearch,
  AddRemoveFavLists: AddRemoveFavLists,
  SimpleTableView: SimpleTableView
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
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} scrollable={true}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            <SpecificSearch {...this.props}/>
          </ModalBody>
          <ModalFooter>
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
