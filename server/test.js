import cherio from 'cherio';
import chalk from 'chalk';
import needle from 'needle';


async function getNewsContent(newsData) {
    try {
        const pageContent = await needle("get", `https://www.nstu.ru/news/news_more?idnews=139128`);
        const $ = cherio.load(pageContent.body, { decodeEntities: false });
        const result = [];
        const fotorama = $("div .fotorama");
        fotorama.children().each((i, el) => {
            result.push($(el).attr('src'));
        })
        // console.log(fotorama.attr('class'));
        // console.log(fotorama.filter($('div.fotorama__wrap fotorama__wrap--css3 fotorama__wrap--slide fotorama__wrap--toggle-arrows fotorama__wrap--no-controls')).length);//.find('img').each((i,el) => {
        // //     console.log($(el).attr('src'));
        // }));
        
        console.log(result);
    } catch (err) {
        throw err;
    }
}
function contentChecker(text) {
    const textLW = text.toLowerCase();
    const keyWords = ['автф', 'магистратура', 'партнерами'];
    keyWords.forEach(el => {
        console.log(el)
        const a = 'автф'.includes('автф');
        console.log(a)
        if (a) {
            console.log('asd')
            return true;
        }
    })
    return false;
}
// await getNewsContent();
// console.log(contentChecker(`<p class="text-lead"></p>,<strong>в среду, 18 мая, на левом берегу новосибирска студенты, сотрудники и выпускники нашего вуза отметили день нгту нэти. на праздник собралось больше 1000 гостей, которые приняли участие в конкурсах, ивентах и дискотеке.<br><br></strong><span style="font-size: 16px;">показываем, как это было, в ярких фотографиях </span><a href="https://vk.com/kostya.zhukov" target="_blank" rel="noopener" style="font-size: 16px;">константина жукова</a><span style="font-size: 16px;"> и </span><a href="https://vk.com/tumaevak" target="_blank" rel="noopener" style="font-size: 16px;">кристины тумаевой</a><span style="font-size: 16px;">. найти себя на фотографиях со дня нгту нэти можно </span><a href="https://vk.com/day_nstu" target="_blank" rel="noopener" style="font-size: 16px;">по этой ссылке</a><span style="font-size: 16px;">.<br><br></span><span style="font-size: 16px;">в этом году день нгту нэти был вдохновлен ценностями семьи, культуры и преемственности поколений, объединяющими студентов, сотрудников, выпускников вуза и жителей новосибирска.<br><br></span><span style="font-size: 16px;">за всю свою 72-летную историю университет выпустил более 200 000 специалистов самых разных профессий, которые работают теперь по всему миру! сейчас каждый четвертый новосибирец — выпускник нгту нэти! а родители, бабушки и дедушки абитуриентов с гордостью говорят: «я учился в нэти». семья — вот что действительно объединяет жителей города.<br><br></span><span style="font-size: 16px;">в этом празднике мы собрали несколько смыслов. один курс — это и целая поточка однокурсников, и общий путь технологического развития университета как лидера отраслей.<br><br></span><strong style="font-size: 16px;">партнерами дня нгту нэти выступили:</strong><span style="font-size: 16px;"> чебурекми, mirotel, эфиоп coffee, vr гравитация, pro-bor, усоц нгту нэти, фаер-шоу аврора, hobby games, max-bus, грильница, laser love, «совесть», сбер и «страна гулливерия».</span>'`))
// console.log('автф'.includes('автф'))
console.log(contentChecker('asd'))