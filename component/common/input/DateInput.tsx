import classNames from 'classnames/bind';
import style from './DateInput.module.scss';
import LeftArrowIcon from 'public/icon/left_arrow.svg';
import RightArrowIcon from 'public/icon/right_arrow.svg';
import FilterTag from '../tag/FilterTag';

const cx = classNames.bind(style);

export default function DateInput() {
  return (
    <div className={cx('dateInput')}>
      <div className={cx('dateInput__header')}>
        <button className={cx('button')}>
          <LeftArrowIcon />
        </button>
        <div className={cx('label')}>1월 2023 ~</div>
        <button className={cx('button')}>
          <RightArrowIcon />
        </button>
      </div>
      <div className={cx('dateInput__selection')}>
        <div className={cx('wrapper')}>
          {Array(12)
            .fill(0)
            .map((i, v) => (
              <FilterTag label={`${v + 1}월`} />
            ))}
        </div>
      </div>
    </div>
  );
}
