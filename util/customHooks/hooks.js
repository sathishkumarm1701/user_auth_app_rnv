import {useMemo} from 'react';

const useDateArray = days => {
  const results = useMemo(() => {
    // get date upto {days} from now
    const daysArray = [];
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    for (let index = 0; index < days; index++) {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const YMS = date.toLocaleDateString().split('/');
      const YMSDate = YMS[2] + '-' + YMS[1] + '-' + YMS[0];
      daysArray.push({
        id: index + 1,
        date: date.getDate(),
        day: weekday[date.getDay()],
        month: month[date.getMonth()],
        monthNumber: date.getMonth() + 1,
        year: date.getFullYear(),
        localDateString: date.toLocaleDateString(),
        dateString: date.toDateString(),
        YMSDate: YMSDate,
      });
    }
    return daysArray;
  }, [days]);

  return results;
};

export default useDateArray;
