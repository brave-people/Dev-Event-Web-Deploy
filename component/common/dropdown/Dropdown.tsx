import classNames from 'classnames/bind';
import style from './Dropdown.module.scss';
import React, { useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import FilterTag from '../tag/FilterTag';
import { useOnClickOutside } from 'lib/hooks/useOnClickOutside';
import { Tag } from 'model/tag';
const cx = classNames.bind(style);

export default function Dropdown({ name, options, placeholder, value, onClick, icon, type = 'basic' }: any) {
  const [isOpen, setOpen] = useState(false);
  const outsideRef = useRef(null);

  const handleClickOutside = () => {
    if (isOpen) {
      setOpen(false);
    }
  };
  const handleClickDropdown = () => {
    if (isOpen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useOnClickOutside({ ref: outsideRef, handler: handleClickOutside, mouseEvent: 'click' });

  return (
    <>
      <div className={cx('dropdown')} ref={outsideRef}>
        <div className={cx('dropdown__header')} onClick={handleClickDropdown}>
          {value ? value : placeholder}
          {!isOpen ? <IoIosArrowDown size="12" color="#3D3D3D" /> : <IoIosArrowUp size="12" color="#3D3D3D" />}
        </div>

        <div className={cx('dropdown__list', `type--${type}`, isOpen ? null : 'hidden')}>
          {options.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={cx('dropdown__list__item', `type--${type}`)}
                onClick={(event) => {
                  setOpen(false);
                  !onClick ? null : onClick(event, item);
                }}
              >
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
