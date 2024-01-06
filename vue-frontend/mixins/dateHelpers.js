import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import endOfDay from 'date-fns/endOfDay'
import format from 'date-fns/format'
import differenceInDays from 'date-fns/differenceInDays'
import intervalToDuration from 'date-fns/intervalToDuration'
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval'
import eachYearOfInterval from 'date-fns/eachYearOfInterval'
import addMonths from 'date-fns/addMonths'

import arSA from 'date-fns/locale/ar-SA'
import de from 'date-fns/locale/de'
import enGB from 'date-fns/locale/en-GB'
import uk from 'date-fns/locale/uk'
import {endOfYear} from "date-fns";


const locales = {
    'en': enGB,
    'ar': arSA,
    'de': de,
    'cz': enGB,
    'am': enGB,
    'ua': uk,
}
const dateHelpers = {
    methods: {
        getDay: function (dateString) {
            const date = new Date(dateString);
            return date.getDate();
        },
        daysLeft: (date, another = null) => {
            let difference = differenceInDays(new Date(date), another || new Date());
            return difference > 0 ? difference : 0;
        },
        dateHelperFormatDate: function (date, formatType = 'EEEEEE, LLL. dd yyyy') {
            // const normalizedDate = typeof date === 'number' ? new Date(date) : parseISO(date);
            return format(new Date(date), formatType, {locale: locales[this.$store.getters.locale]});
        },
        dateHelperGetEndOfDay: (date) => {
            return endOfDay(Date.parse(date))
        },
        dateHelperGetEndOfYear: (date) => {
            return endOfYear(Date.parse(date))
        },
        dateHelperGetDaysArray: (start, end) => {
            try {
                return eachDayOfInterval({start: new Date(start), end: new Date(end)})
            } catch (e) {
                return [start, end]
            }
        },
        dateHelperEachYearOfInterval: ((start, end) => {
            return eachYearOfInterval({
                start: new Date(start),
                end: new Date(end)
            })
        }),
        dateHelperAddMonth: (date, months) => {
            return addMonths(new Date(date), months)
        },
        dateHelperGetMonthsArray: (start, end) => {
            try {
                return eachMonthOfInterval({start: new Date(start), end: new Date(end)})
            } catch (e) {
                return [start, end]
            }
        },
        dateHelperIntervalToDuration(start, end) {
            return intervalToDuration({start: new Date(start), end: new Date(end)});
        }
    }
};

export default dateHelpers;
