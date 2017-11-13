import PropTypes from 'prop-types';
import React from 'react';

export default class UserEntry extends React.Component {

  static propTypes = {
    entry: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar_url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      view_entity_path: PropTypes.string.isRequired,
      edit_entity_path: PropTypes.string.isRequired,
      registration: PropTypes.string.isRequired,
      // Depending on the view we render, +is_assigned+ could be nil, true or false
      is_assigned: PropTypes.any.required,
    }),
    handleAssign: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.entry.is_assigned !== nextProps.entry.is_assigned
  }

  render() {
    return (
      <tr>
        <td>
          <div className={'table-entry'}><img className="avatar-table-entry" src={this.props.entry['avatar_url']}/>
            <span>
              <a className={'user-entry-color'}
                 href={this.props.entry['view_entity_path']}>{this.props.entry['name']}</a>
            </span>
          </div>
        </td>

        <td>
          <div className={'table-entry'}>
            <span>{this.props.entry['email']}</span>
          </div>
        </td>

        <td>
          <div className={'table-entry'}>
            <span>{this.props.entry['type']}</span>
          </div>
        </td>

        <td>
          <div className={'table-entry'}>
            <span>{this.props.entry['registration']}</span>
          </div>
        </td>

        <td>
          <div className="action-buttons-container table-entry">
            <div className="btn-group min-width" role="group" aria-label="...">
              {console.log(this.props.entry['is_assigned'])}
              {this.props.handleAssign
                ? <a onClick={this.props.handleAssign}
                     data-uid={this.props.entry.id}
                     title='View Profile'
                     className='btn btn-default ef-btn'
                     href={this.props.entry['view_entity_path']}>
                  {
                    this.props.entry['is_assigned']
                      ? 'UNASSIGN'
                      : 'ASSIGN'
                  }
                </a>
                : <div className="btn-group">

                  <div className="btn-group" role="group" aria-label="...">
                    <a title="View Profile" className="btn btn-default" href={this.props.entry['view_entity_path']}>
                      <i className="pr-icon action-button-graphic xs bar-chart"> </i>
                    </a>
                  </div>

                  <div className="btn-group" role="group" aria-label="...">
                    <a title="Edit User" className="btn btn-default" href={this.props.entry['edit_entity_path']}>
                      <i className="pr-icon action-button-graphic xs pencil"> </i>
                    </a>
                  </div>

                  <div className="btn-group" role="group" aria-label="...">
                    <a title="Delete User"
                       className="btn btn-default"
                       href={this.props.entry['view_entity_path']}
                       data-method="delete"
                       data-confirm="Are you sure?"
                       rel="nofollow">
                      <i className="pr-icon action-button-graphic xs user-delete"> </i>
                    </a>
                  </div>

                </div>
              }
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
