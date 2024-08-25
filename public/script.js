// script.js
document.querySelector('.navbar-toggle').addEventListener('click', function () {
    const tabs = document.querySelector('.navbar-tabs');
    tabs.classList.toggle('active');
  });

document.addEventListener('DOMContentLoaded', function () {
    // Show the home tab content by default
    document.getElementById('home').style.display = 'block';
    document.querySelector('.navbar a[href="#home"]').classList.add('active');
});

document.querySelectorAll('.navbar a').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelectorAll('.navbar a').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(this.getAttribute('href').substring(1)).style.display = 'block';
        this.classList.add('active');
    });
});

function generateCron() {
    const seconds = document.getElementById('seconds').value.trim() || '*';
    const minutes = document.getElementById('minutes').value.trim() || '*';
    const hours = document.getElementById('hours').value.trim() || '*';
    const dayOfMonth = document.getElementById('dayOfMonth').value.trim() || '*';
    const month = document.getElementById('month').value.trim() || '*';
    const dayOfWeek = document.getElementById('dayOfWeek').value.trim() || '*';

    const cronExpression = `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
    const description = generateDescription(seconds, minutes, hours, dayOfMonth, month, dayOfWeek);

    document.getElementById('cronExpression').textContent = cronExpression;
    document.getElementById('description').textContent = description;
}

function generateDescription(seconds, minutes, hours, dayOfMonth, month, dayOfWeek) {
    let descriptionParts = [];
    
    // seconds calculations
    if (seconds === '*') {
        descriptionParts.push('every second');
    } else {
        if(seconds === '0'){
            descriptionParts.push(``);
        }else{
            descriptionParts.push(`${seconds} seconds`);
        }   
    }
    
    // minutes calculations
    if (minutes === '*') {
        descriptionParts.push('every minute');
    } else {
        if(minutes === '0'){
            descriptionParts.push(``);
        }else if (minutes.includes('*/') || minutes.includes('0/')) {
            let minIncrements = minutes.split('/');
            descriptionParts.push(`every ${minIncrements[1]} minutes`);
        }else{
            descriptionParts.push(`${minutes} minutes`);
        }
    }
    
    // hours calculations
    if (hours === '*') {
        descriptionParts.push('every hour');
    } else if (hours.includes('-')) {
        let hrsRange = hours.split('-');
        descriptionParts.push(`from ${convertHours(hrsRange[0])} to ${convertHours(hrsRange[1])} `);
    }else if (hours.includes('*/') || hours.includes('0/')) {
        let hrIncrements = hours.split('/');
        descriptionParts.push(`every ${hrIncrements[1]} hours`);
    }else if (hours.includes('/')) {
        let hrIncrements2 = hours.split('/');
        descriptionParts.push(`every ${hrIncrements2[1]} hours starting from ${convertHours(hrIncrements2[0])} `);
    }else {
        descriptionParts.push(`${convertHours(hours)} `);
    }
    
    // dayofMonth calculations
    if (dayOfMonth === '*') {
        // No specific value for dayOfMonth, so it’s implied
        descriptionParts.push('every day of the month');
    }else if (dayOfMonth === '?') {
        descriptionParts.push('');
    }else if (dayOfMonth === 'L') {
        descriptionParts.push('on the last day of the month');
    } else if (dayOfMonth.includes('-')) {
        let dayofMonthRange = dayOfMonth.split('-');
        descriptionParts.push(`on days from ${dayofMonthRange[0]} to ${dayofMonthRange[1]} of the month`);
    }else if (dayOfMonth.includes('*/') || dayOfMonth.includes('0/')) {
        let dayofMonthIncrements = dayOfMonth.split('/');
        descriptionParts.push(`every ${dayofMonthIncrements[1]} days of a month`);
    }else if (dayOfMonth.includes('/')) {
        let dayofMonthIncrements2 = dayOfMonth.split('/');
        descriptionParts.push(`every ${dayofMonthIncrements2[1]} day starting from day ${dayofMonthIncrements2[0]} of a month`);
    }else {
        descriptionParts.push(`on day ${dayOfMonth} of the month`);
    }
    
    // Month calculations
    if (month === '*') {
        descriptionParts.push('every month');
    } else if (month.includes(',')) {
        descriptionParts.push(`in ${convertMonths(month).replace(/,/g, ', ')}`);
    }else if (month.includes('-')) {
        let monthRange = month.split('-');
        descriptionParts.push(`from ${convertMonths(monthRange[0])} to ${convertMonths(monthRange[1])} `);
    }else if (month.includes('*/') || month.includes('0/')) {
        let monthsIncrement = month.split('/');
        descriptionParts.push(`every ${monthsIncrement[1]} month `);
    }else if (month.includes('/')) {
        let monthsIncrement2 = month.split('/');
        descriptionParts.push(`every ${monthsIncrement2[1]} month starting from ${convertMonths(monthsIncrement2[0])} `);
    } else {
        descriptionParts.push(`in ${convertMonths(month)}`);
    }
    
    // dayofWeek calculations
    if (dayOfWeek === '*' ) {
        // No specific value for dayOfWeek, so it’s implied
        descriptionParts.push('every day of the week');
    } else if (dayOfWeek === '?') {
        descriptionParts.push('');
    }else if (dayOfWeek === 'L') {
        descriptionParts.push('on the last day of the week');
    }else if (dayOfWeek.includes('-')) {
        let dayOfWeekRange = dayOfWeek.split('-');
        descriptionParts.push(`from ${convertDayOfWeek(dayOfWeekRange[0])} to ${convertDayOfWeek(dayOfWeekRange[1])} `);
    }else if (dayOfWeek.includes('#')) {
        let nthDayArray = dayOfWeek.split('#');
        descriptionParts.push(`on every ${convertToNthDay(nthDayArray[1])} ${convertDayOfWeek(nthDayArray[0])} `);
    } else {
        descriptionParts.push(`on ${convertDayOfWeek(dayOfWeek)}`);
    }
    
    // Filter out empty parts
    descriptionParts = descriptionParts.filter(part => part !== '');

    return `The Job will run at ${descriptionParts.join(', ')}.`;
}

function convertDayOfWeek(dayOfWeek) {
    const dayMapping = {
        '1': 'Sunday',
        '2': 'Monday',
        '3': 'Tuesday',
        '4': 'Wednesday',
        '5': 'Thursday',
        '6': 'Friday',
        '7': 'Saturday',
        'SUN': 'Sunday',
        'MON': 'Monday',
        'TUE': 'Tuesday',
        'WED': 'Wednesday',
        'THU': 'Thursday',
        'FRI': 'Friday',
        'SAT': 'Saturday'
    };
    const days = dayOfWeek.split(',').map(day => dayMapping[day] || day).join(', ');
    return days;
}

function convertMonths(month) {
    const monthsMapping = {
        '1': 'January',
        '2': 'Februay',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
        'JAN': 'January',
        'FEB': 'Februay',
        'MAR': 'March',
        'APR': 'April',
        'MAY': 'May',
        'JUN': 'June',
        'JUL': 'July',
        'AUG': 'August',
        'SEP': 'September',
        'OCT': 'October',
        'NOV': 'November',
        'DEC': 'December'
    };
    const m = month.split(',').map(mon => monthsMapping[mon] || mon).join(', ');
    return m;
}

function convertHours(hour) {
    const hoursMapping = {
        '1': '1 AM',
        '2': '2 AM',
        '3': '3 AM',
        '4': '4 AM',
        '5': '5 AM',
        '6': '6 AM',
        '7': '7 AM',
        '8': '8 AM',
        '9': '9 AM',
        '10': '10 AM',
        '11': '11 AM',
        '12': '12 PM',
        '13': '1 PM',
        '14': '2 PM',
        '15': '3 PM',
        '16': '4 PM',
        '17': '5 PM',
        '18': '6 PM',
        '19': '7 PM',
        '20': '8 PM',
        '21': '9 PM',
        '22': '10 PM',
        '23': '11 PM',
        '0': '12 AM (midnight)'
    };
    const h = hour.split(',').map(hrs => hoursMapping[hrs] || hrs).join(', ');
    return h;
}


function convertToNthDay(dayNo) {
    const dayMapping = {
        '1': 'first',
        '2': 'second',
        '3': 'third',
        '4': 'fourth',
        '5': 'fifth',
        '6': 'sixth',
        '7': 'seventh',
        '8': 'eighth',
        '9': 'nineth',
        '10': 'tenth'
    };
    const nthDay = dayNo.split(',').map(day => dayMapping[day] || day).join(', ');
    return nthDay;
}
