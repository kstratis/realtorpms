import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRemoveFavLists from './AddRemoveFavLists';

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
      <>
        <Button className={'btn-sm'} color="secondary" onClick={this.toggle}>
          <div dangerouslySetInnerHTML={{ __html: this.props.fireButtonLabel }} />
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} scrollable={true}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            <AddRemoveFavLists {...this.props} />
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
