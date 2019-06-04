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
      <div className={''}>
        <Button color="danger" onClick={this.toggle}><div dangerouslySetInnerHTML={{ __html: this.props.fireButtonLabel }}/></Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            <AddRemoveFavLists avatar={this.props.avatar} favlists_url={this.props.favlists_url} i18n={this.props.i18n} />

            {/*<Select options={*/}
            {/*  [{ value: 'chocolate', label: 'Chocolate' },*/}
            {/*    { value: 'strawberry', label: 'Strawberry' },*/}
            {/*    { value: 'vanilla', label: 'Vanilla' }]*/}
            {/*} />*/}
          </ModalBody>
          <ModalFooter>
            {/*<Button color="primary" onClick={this.toggle}>{this.props.buttonOKLabel}</Button>{' '}*/}
            <Button color="secondary" onClick={this.toggle}>{this.props.buttonCloseLabel}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalContainer;