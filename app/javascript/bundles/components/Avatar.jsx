import React from 'react';
import { isUrl } from '../utilities/helpers';

function Avatar(props) {
  return (
    <div className={'avatar-wrapper'}>
      <div className={'user-avatar user-avatar-lg user-avatar-js'}>
      {isUrl(props.data.url)
        ? <img className={`${props.data.classname}`} src={props.data.url} alt={'avatar'} />
        : <div className={'alphatar'} style={{backgroundColor: `#${props.data.usercolor}`}}>{props.data.url}</div>
      }
      </div>
    </div>
  );
}

export default Avatar;