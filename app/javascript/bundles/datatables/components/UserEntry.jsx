import PropTypes from 'prop-types';
import React from 'react';


export default class UserEntry extends React.Component {
  // static propTypes = {
  //   initial_payload: PropTypes.shape({
  //     dataset_wrapper: PropTypes.object.isRequired,
  //     results_per_page: PropTypes.number.isRequired,
  //     total_entries: PropTypes.number.isRequired,
  //     object_type: PropTypes.string.isRequired,
  //     current_page: PropTypes.number,
  //     select_mode: PropTypes.bool,
  //     pid: PropTypes.number // This is the property id
  //   })
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {

    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('#######');
    console.log(nextProps);
    console.log('-------');
    console.log(nextState);
    console.log('#######');

  }

  render(){
    return(
      <tr key={entry.id}>
        <td><div className={'table-entry'}><img className="avatar-table-entry" src={entry['avatar_url']}/><span><a className={'user-entry-color'} href={entry['view_entity_path']}>{entry['name']}</a></span></div></td>
        <td><div className={'table-entry'}><span>{entry['email']}</span></div></td>
        <td><div className={'table-entry'}><span>{entry['type']}</span></div></td>
        {/*<td><div className={'table-entry'}></div></td>*/}
        <td><div className={'table-entry'}><span>{entry['registration']}</span></div></td>
        <td>
          <div className="action-buttons-container table-entry">
            <div className="btn-group min-width" role="group" aria-label="...">
              {/*<div className="btn-group" role="group" aria-label="..."><a title="User Assignments" className="btn btn-default" href=""><i className="pr-icon action-button-graphic xs assignments"> </i></a></div>*/}


              {handleAssign
                ? <a onClick={handleAssign} data-uid={entry.id} title="View Profile" className="btn btn-default ef-btn" href={entry['view_entity_path']}>
                  {console.log(entry.is_assigned)}
                  {console.log(entry.id)}
                  {
                    entry.is_assigned
                      ? 'UNASSIGN'
                      : 'ASSIGN'
                  }
                </a>
                : <div>
                  <div className="btn-group" role="group" aria-label="..."><a title="View Profile" className="btn btn-default" href={entry['view_entity_path']}><i className="pr-icon action-button-graphic xs bar-chart"> </i></a></div>
                  <div className="btn-group" role="group" aria-label="..."><a title="Edit User" className="btn btn-default" href={entry['edit_entity_path']}><i className="pr-icon action-button-graphic xs pencil"> </i></a></div>
                  <div className="btn-group" role="group" aria-label="..."><a title="Delete User"
                                                                              className="btn btn-default"
                                                                              href={entry['view_entity_path']}
                                                                              data-method="delete"
                                                                              data-confirm="Are you sure?"
                                                                              rel="nofollow"><i className="pr-icon action-button-graphic xs user-delete"> </i></a></div>
                </div>
              }


              {/*<a title="Edit user" className="btn btn-default" href=""><i className="fa fa-pencil fa-fw fa-lg"> </i></a>*/}
              {/*<a title="Deactivate user" className="btn btn-default" href=""><i className="fa fa-power-off fa-fw fa-lg"> </i></a>*/}
              {/*<a title="Delete user user" className="btn btn-default" href=""><i className="fa fa-trash fa-fw fa-lg"> </i></a>*/}
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
