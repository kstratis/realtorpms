import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRemoveFavLists from './AddRemoveFavLists';
import Spinner from '../datatables/Spinner';

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
    return (
      <div className={''}>
        <Button color="danger" onClick={this.toggle}>
          <div dangerouslySetInnerHTML={{ __html: this.props.fireButtonLabel }} />
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} scrollable={true}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            <AddRemoveFavLists {...this.props} ref={this.FavListManager} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              {this.props.buttonCloseLabel}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalContainer;
