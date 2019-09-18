import React from 'react';
import { isUrl } from '../utilities/helpers';

function Avatar(props) {
  return (
    <div className={`avatar-wrapper`}>
      <div className={`${isUrl(props.data.url) ? 'user-avatar user-avatar-md mr-2' : ''}`}>
      {isUrl(props.data.url)
        ? <img className={`${props.data.classname}`} src={props.data.url} alt={'avatar'} />
        : <div style={{backgroundColor: `${props.data.usercolor}`, color: '#ffffff'}} className="tile pr-tile tile-circle tile-md mr-2">{props.data.url}</div>
      }
      </div>
    </div>
  );
}

export default Avatar;