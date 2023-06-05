import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from 'styles/Home.module.scss';
import Dropdown from 'component/common/dropdown/Dropdown';
import { AiTwotoneCalendar } from 'react-icons/ai';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useScheduledEvents, useTags } from 'lib/hooks/useSWR';
import * as ga from 'lib/utils/gTag';
import FilterTag from 'component/common/tag/FilterTag';
import SearchInput from 'component/common/input/SearchInput';
import DateInput from 'component/common/input/DateInput';

const cn = classNames.bind(style);

const EventFilters = () => {
  const router = useRouter();
  const [filter, setFilter] = useState({ date: '전체', tag: '태그' });
  const [lastDate, setLastDate] = useState({ year: 0, month: 0 });

  const { tags, isError: isTagError } = useTags();
  const { scheduledEvents, isError: isEventError } = useScheduledEvents();

  useEffect(() => {
    if (router.query.year && router.query.month) {
      setFilter({ ...filter, date: `${router.query.year}년 ${router.query.month}월` });
    } else if (router.query.tag || router.query.keyword) {
      setFilter({ ...filter, date: '전체' });
    } else {
      setFilter({ ...filter, date: '전체' });
    }
  }, [router.query]);

  useEffect(() => {
    getEventLastMonth();
  }, [scheduledEvents]);

  const getEventLastMonth = () => {
    if (scheduledEvents && !isEventError && scheduledEvents.length !== 0) {
      const lastyear = scheduledEvents[scheduledEvents.length - 1].metadata.year;
      const lastmonth = scheduledEvents[scheduledEvents.length - 1].metadata.month;
      setLastDate({ year: lastyear, month: lastmonth });
    } else {
      let currentYear = dayjs().get('year');
      let currentMonth = dayjs().get('month') + 1;

      setLastDate({ year: currentYear, month: currentMonth });
    }
  };

  const getDateList = () => {
    const list = ['전체'];
    let currentDate = dayjs()
      .set('year', lastDate.year)
      .set('month', lastDate.month - 1)
      .endOf('month');
    const startDate = dayjs('2022-06-01');
    while (startDate.isBefore(currentDate)) {
      list.push(currentDate.format('YYYY년 MM월'));
      currentDate = currentDate.subtract(1, 'M');
    }
    return list;
  };

  const getTagList = () => {
    if (tags && !isTagError) {
      const list = tags.map((tag) => {
        return tag.tag_name;
      });
      console.log(list);

      return list;
    }
    return [];
  };

  const onClickFilterOption = (event: any) => {
    ga.event({
      action: 'web_event_태그옵션클릭',
      event_category: 'web_event',
      event_label: '검색',
    });
    if (event.target.innerText === '전체') {
      router.replace(`/events`);
    } else {
      const tag = event.target.innerText.replace(/[\t\s\#]/g, '');
      router.replace(`/search?tag=${tag}`);
    }
  };

  const TagOptions = ['태그1', '태그2', '태그3', '태그4', '태그5', '태그6'];
  return (
    <div className={cn('event-filter')}>
      <div className={cn('tags')}>
        {TagOptions.map((option) => {
          return <FilterTag label={option} state="clicked" />;
        })}
      </div>
      <div className={cn('filter-wrap')}>
        <div className={cn('filters')}>
          <SearchInput />
          <Dropdown
            placeholder="행사 유형"
            options={getTagList()}
            value={filter.date}
            onClick={onClickFilterOption}
          ></Dropdown>
          <Dropdown
            placeholder="참여 방법"
            options={['전체', '온라인', '오프라인']}
            value={filter.date}
            onClick={onClickFilterOption}
          ></Dropdown>
          <Dropdown
            placeholder="비용"
            options={['전체', '무료', '유료']}
            value={filter.date}
            onClick={onClickFilterOption}
          ></Dropdown>
        </div>
        <div className={cn('datepicker')}>
          <DateInput />
          {/* <Dropdown
            options={getDateList()}
            placeholder="전체"
            value={filter.date}
            icon={<AiTwotoneCalendar size={16} />}
            onClick={(event: any) => {
              ga.event({
                action: 'web_event_월별옵션클릭',
                event_category: 'web_event',
                event_label: '검색',
              });
              if (event.target.innerText === '전체') {
                router.replace(`/events`);
              } else {
                const date = event.target.innerText.replace(/[\t\s]/g, '').split(/[년, 월]/);
                router.replace(`/calender?year=${date[0]}&month=${date[1]}`);
              }
            }}
          ></Dropdown> */}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
