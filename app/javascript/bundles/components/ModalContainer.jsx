import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddRemoveFavLists from './AddRemoveFavLists';
import Spinner from '../datatables/Spinner';

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      // isLoading: true
    };

    this.toggle = this.toggle.bind(this);
    // this.setLoading = this.setLoading.bind(this);
  }

  // setLoading(status) {
  //   this.setState({
  //     isLoading: status
  //   });
  // }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  render() {
    return (
      <div className={''}>
        <Button color="danger" onClick={this.toggle}><div dangerouslySetInnerHTML={{ __html: this.props.fireButtonLabel }}/></Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} scrollable={true}>

          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            {/*<AddRemoveFavLists avatar={this.props.avatar} favlists_get_url={this.props.favlists_get_url} favlists_post_url={this.props.favlists_post_url} i18n={this.props.i18n} setLoading={this.setLoading} isLoading={this.state.isLoading}/>*/}
            <AddRemoveFavLists avatar={this.props.avatar} favorites_url={this.props.favorites_url} favlists_url={this.props.favlists_url} i18n={this.props.i18n}/>

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