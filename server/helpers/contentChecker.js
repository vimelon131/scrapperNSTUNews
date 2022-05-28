function contentChecker(text) {
    const textLW = text.toLowerCase();
    let cnt = 0;
    const keyWords = ['автф', 'магистратура'];
    keyWords.forEach(el => {
        if (textLW.includes(el)) {
            cnt += 1;
        }
    })
    return cnt > 0 ? true : false;
}

export default contentChecker;