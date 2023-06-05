import classNames from 'classnames/bind';
import React, { useEffect } from 'react';
import style from './FilterTag.module.scss';
const cx = classNames.bind(style);

function FilterTag({ onClick, label, size = 'regular', state = 'default' || 'clicked' }: any) {
  return (
    <button className={cx('tag', `size--${size}`, `color--${state}`)} onClick={onClick}>
      {label}
    </button>
  );
}

export default FilterTag;
