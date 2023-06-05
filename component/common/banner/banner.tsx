import classNames from 'classnames/bind';
import React from 'react';
import style from './banner.module.scss';
import Image from 'next/image';
const cn = classNames.bind(style);

function Banner() {
  return (
    <div className={cn('banner')}>
      {/* <h1 className={cn('banner__title')}>
        개발자 행사는
        <br /> 모두 Dev Event 웹에서
      </h1>
      <h3 className={cn('banner__desc')}>진행 중인 행사부터 종료된 행사까지, 놓치지 마세요! </h3> */}
      <div className={cn('banner__image')}>
        <Image src="/default/banner_example.png" layout="fill" objectFit="contain" objectPosition="center" />
      </div>
    </div>
  );
}

export default Banner;
