export function fromStringToData(dataString) {
    const regex = /([а-яА-Я])*/g;
    const initialMonth = dataString.match(regex)
        .filter(el => (el != null && el != "" || el === 0))
        .toString();
    let formatedData = '';
    switch (initialMonth) {
        case 'февраля': 
            formatedData = dataString.replace('февраля','february');
            break;
        case 'января':
            formatedData = dataString.replace('января','january');
            break;
        case 'марта':
            formatedData = dataString.replace("марта","march");
            break;
        case 'апреля':
            formatedData = dataString.replace('апреля','april');
            break;
        case 'мая':
            formatedData = dataString.replace('мая','may');
            break;
        case 'июня':
            formatedData = dataString.replace('июня','june');
            break;
        case 'июля':
            formatedData = dataString.replace('июля','july');
            break;
        case 'августа':
            formatedData = dataString.replace('августа','august');
            break;
        case 'сентября':
            formatedData = dataString.replace('сентября','september');
            break;
        case 'октября':
            formatedData = dataString.replace('октября','october');
            break;
        case 'ноября':
            formatedData = dataString.replace('ноября','november');
            break;
        case 'декабря':
            formatedData = dataString.replace('декабря','december');
            break;
        default:
            break;
    }
    const date = new Date(Date.parse(formatedData));
    
    return date;
}

