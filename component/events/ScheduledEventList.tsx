import React, { useEffect, useState } from 'react';
import { useScheduledEvents } from 'lib/hooks/useSWR';
import { EventResponse, EventDate } from 'model/event';
import classNames from 'classnames/bind';
import style from 'styles/Home.module.scss';
import { ThreeDots } from 'react-loader-spinner';
import List from 'component/common/list/list';
import { DateUtil } from 'lib/utils/dateUtil';
import FillButton from 'component/common/buttons/FillButton';
import Link from 'next/link';
import * as ga from 'lib/utils/gTag';
import EventFilters from './EventFilters';

const cn = classNames.bind(style);

const ScheduledEventList = ({ fallbackData }: { fallbackData: EventResponse[] }) => {
  const [totalCount, setTotalCount] = useState(0);
  const { scheduledEvents, isError } = useScheduledEvents(fallbackData);

  useEffect(() => {
    composeTotalCount();
  }, [scheduledEvents]);

  if (isError) {
    return <div className={cn('null-container')}>이벤트 정보를 불러오는데 문제가 발생했습니다!</div>;
  }

  const composeTotalCount = () => {
    if (scheduledEvents && !isError && scheduledEvents.length !== 0) {
      const result = scheduledEvents.reduce(function add(sum, currValue) {
        const filteredEvents = currValue.dev_event.filter(
          (item) =>
            checkEventDone({
              endDate: getEventEndDate({
                start_date_time: item.start_date_time,
                end_date_time: item.end_date_time,
                use_start_date_time_yn: item.use_start_date_time_yn,
                use_end_date_time_yn: item.use_end_date_time_yn,
              }),
            }) === false
        );
        return sum + filteredEvents.length;
      }, 0);
      setTotalCount(result);
    }
  };

  const getEventEndDate = (EventDate: EventDate) => {
    if (EventDate.use_start_date_time_yn && EventDate.use_end_date_time_yn) {
      return EventDate.end_date_time;
    }
    if (EventDate.use_start_date_time_yn && !EventDate.use_end_date_time_yn) {
      return EventDate.start_date_time;
    }
    if (!EventDate.use_start_date_time_yn && EventDate.use_end_date_time_yn) {
      return EventDate.end_date_time;
    }
    return EventDate.end_date_time;
  };

  const checkEventDone = ({ endDate }: { endDate: string }) => {
    return DateUtil.isDone(endDate);
  };

  return (
    <>
      <div className={cn('section__header')}>
        <span className={cn('section__header__title')}>전체 행사</span>
        <span className={cn('section__header__button')}>
          <Link href={'https://forms.gle/UUjUVg1tTrKhemKu9'}>
            <a target="_blank">
              <FillButton
                color="primary"
                label="+ 행사 추가 요청"
                onClick={() => {
                  ga.event({
                    action: 'web_event_행사등록버튼클릭',
                    event_category: 'web_event',
                    event_label: '행사등록',
                  });
                }}
              />
            </a>
          </Link>
        </span>
      </div>
      <div className={cn('section__sub-header')}>
        <EventFilters />
      </div>
      {scheduledEvents ? (
        scheduledEvents.length !== 0 ? (
          scheduledEvents.map((event: EventResponse, index) => {
            const lists =
              event &&
              event.dev_event.filter(
                (item) =>
                  !checkEventDone({
                    endDate: getEventEndDate({
                      start_date_time: item.start_date_time,
                      end_date_time: item.end_date_time,
                      use_start_date_time_yn: item.use_start_date_time_yn,
                      use_end_date_time_yn: item.use_end_date_time_yn,
                    }),
                  })
              );

            return lists.length > 0 ? (
              <>
                <div className={cn('section__list')}>
                  <div className={cn('section__list__title')}>
                    <span>{`${event.metadata.month}월`}</span>
                  </div>
                  <List data={lists} />
                </div>
                {index === scheduledEvents.length - 1 ? null : <hr className={cn('divider')} />}
              </>
            ) : null;
          })
        ) : (
          <div className={cn('null-container')}>아직 조건에 맞는 개발자 행사가 없어요 📂</div>
        )
      ) : (
        <div className={cn('null-container')}>
          <ThreeDots color="#479EF1" height={60} width={60} />
        </div>
      )}
    </>
  );
};
export default ScheduledEventList;
