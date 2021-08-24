const baseParse = _ => {
    // 初始化
    let d = [];
    const base_url = "https://www.huashi6.com"
    const empty = "hiker://empty"
    const page = MY_URL.split('##')[1]
    const cateArray = [
        {
            title: '关注画师',
            url: empty,
        },
        {
            title: '新作',
            url: "https://www.huashi6.com/share_"+page,
        },
        {
            title: '热门',
            url: "https://www.huashi6.com/hot_"+page,
        },
        {
            title: '标签',
            url: "https://www.huashi6.com/tags",
        },
        {
            title: '今日榜单',
            url: empty,
        },
        {
            title: '推荐画师',
            url: empty,
        },
        {
            title: '取消关注',
            url: empty,
        },
        {
            title: '置顶关注',
            url: empty,
        }
    ]


    // 缓存
    let cate = getVar("tyrantgenesis.huashi6.cate_select", "0")
    let tag = getVar("tyrantgenesis.huashi6.tag_select", "0")

    if (parseInt(page) === 1) {
        cateArray.forEach((item, index) => {
            d.push({
                title: parseInt(cate) === index ? '‘‘’’<strong><font color="red">'+item.title+'</font></strong>' : item.title,
                url: $(empty).lazyRule(params => {
                    putVar("tyrantgenesis.huashi6.cate_select", params.index.toString())
                    refreshPage(true)
                    return "hiker://empty"
                }, {
                    item: item,
                    index: index
                }),
                col_type: 'scroll_button',
            })
        })
    }

    switch (cate) {
        case '0': {
            break
        }
        case '1':
        case '2': {
            let html = fetch(cateArray[parseInt(cate)].url, {headers:{"User-Agent": PC_UA}})

            let list = parseDomForArray(html, '.px-container&&.px-waterfall-item')

            list.forEach(item => {
                d.push({
                    title: parseDomForHtml(item, '.px-info-title&&Text'),
                    pic_url: parseDomForHtml(item, 'source&&srcset').split(' ')[0]+'@Referer='+base_url,
                    url: parseDomForHtml(item, 'a&&href'),
                    desc: parseDomForHtml(item, '.painter-name&&Text'),
                    col_type: 'movie_3'
                })
            })

            break
        }
        case '3': {
            let html = fetch(cateArray[parseInt(cate)].url, {headers:{"User-Agent": PC_UA}})

            let list = parseDomForArray(html, '.c-tag-alphabet-list&&li')

            list.forEach((item, index) => {
                let title = parseDomForHtml(item, '.row-label&&Text')
                let tagList = parseDomForArray(item, '.label-list&&a')
                d.push({
                    title: '首字母：'+title,
                    col_type: 'text_1'
                })
                tagList.forEach(tag => {
                    d.push({
                        title: parseDomForHtml(tag, 'a&&Text'),
                        url: parseDomForHtml(tag, 'a&&href'),
                        col_type: 'flex_button',
                    })
                })
                d.push({
                    col_type: 'line_blank'
                })
            })

            break
        }
    }

    setResult(d);
}