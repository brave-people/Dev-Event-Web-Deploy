import classNames from 'classnames/bind';
import style from './SearchInput.module.scss';

const cx = classNames.bind(style);

export default function SearchInput() {
  return <input className={cx('input')} placeholder="행사 검색하기" />;
}
