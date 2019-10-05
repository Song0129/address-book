//index.js
var pinyin = require("../../utils/pinyin.js")

Page({
    data: {
        list: [
            { name: "a阿拉善盟" }, { name: "白山" }, { name: "保定" }, { name: "保安" }, { name: "保护" }, { name: "朝阳" }, { name: "晨光" }, { name: "城管" }, { name: "东光" }, { name: "导师" }, { name: "导员" }, { name: "鄂州" }, { name: "额贼" }, { name: "儿科" }, { name: "二哈" }, { name: "丰台" }, { name: "方言" }, { name: "房子" }, { name: "广州" }, { name: "广西" }, { name: "滚蛋" }, { name: "海-南" }, { name: "哈哈" }, { name: "哈士奇" }, { name: "河北" }, { name: "江苏" }, { name: "唧-唧" }, { name: "济南" }, { name: "矿-山" }, { name: "困难" }, { name: "抠门" }, { name: "兰花" }, { name: "篮子" }, { name: "芒果" }, { name: "妈的" },
            { name: "mongo" }, { name: "牛奶" }, { name: "南京" }, { name: "欧豪" }, { name: "派南" }, { name: "帕萨特" }, { name: "奇步" }, { name: "全部" }, { name: "人类" }, { name: "然而" }, { name: "孙尚香" }, { name: "送礼" }, { name: "通州" }, { name: "特别" }, { name: "unix" }, { name: "vv" }, { name: "外滩" }, { name: "网吧" },
            { name: "西西里" }, { name: "熊大" }, { name: "云南" }, { name: "有道" }, { name: "周公" }, { name: "这里" },
            { name: "apple" }, { name: "apply" }, { name: "back" }, { name: "cookie" }, { name: "dom" }, { name: "document" }, { name: "element" }, { name: "fuck" }, { name: "good" }, { name: "hello" }, { name: "hi" }, { name: "job" },
            { name: "just" }, { name: "keep" }, { name: "loop" }, { name: "look" }, { name: "moon" }, { name: "monkey" }, { name: "node" }, { name: "nice" }, { name: "opera" }, { name: "past" }, { name: "pass" }, { name: "question" }, { name: "red" },
            { name: "store" }, { name: "token" }, { name: "uni-app" }, { name: "version" }, { name: "work" }, { name: "x-ray" }, { name: "yellow" }, { name: "zoom" }, { name: "i拼音" }
            , { name: "123" }
        ],
        personList:[],
        oHeight:''
    },
    onLoad: function () {
        // 获取设备高度
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    oHeight: res.windowHeight
                })
            }
        })
        // 调用数据处理函数
        this.list()
    },
    // 数据处理函数
    list(){
        let personList = this.data.personList
        let i = 0
        /**
         * 1、调用外部js的方法ChineseToPinYin对数据进行分组
         * 2、分组的结果存在排序有误的情况,例如I组,V组等没有汉字的分组
         */
        this.data.list.forEach((item, index) => {
            let bool = personList.some(ite => {
                return ite.sign == pinyin.ChineseToPinYin(item.name).substr(0, 1)
            })
            if (personList.length == 0 || !bool) {
                personList.push({
                    id: i,
                    sign: pinyin.ChineseToPinYin(item.name).substr(0, 1),
                    name: [item]
                })
                i++
            } else if (bool) {
                let a = pinyin.ChineseToPinYin(item.name).substr(0, 1)
                for (let s in personList) {
                    if (a == personList[s].sign) {
                        personList[s].name.push(item)
                    }
                }
            }
        })
        this.setData({
            personList,
        })
        /**
         * 3、对分组好的数据进行排序
         * 4、根据标志sign的ASCII码进行初次排序筛选
         * 5、如果标志sign不在A到Z之间,则添加到#分组中
         */
        this.data.personList.forEach((item, index) => {
            if ((item.sign.charCodeAt() < 65 || item.sign.charCodeAt() > 90) && item.sign.charCodeAt() != 35) {
                this.data.personList.splice(index, 1, "")
                // 注:此处为防止splice分割后,数组索引index发生变化,故将需要剔除的元素替换为“”,后再将其剔除
                let i = this.data.personList.findIndex(item => {
                    return item.sign == '#'
                })
                if (i != -1) {
                    item.name.forEach(it => {
                        this.data.personList[i].name.push(it)
                    })

                } else {
                    this.data.personList.push({
                        id: 99,
                        sign: '#',
                        name: item.name
                    })
                }
            }
        })
        // 利用filter方法,剔除之前存在的空元素
        personList = this.data.personList.filter(function (s) {
            return s != ''; // 注：IE9(不包含IE9)以下的版本没有trim()方法
        });
        this.setData({
            personList
        })
        // 利用sort方法进行排序
        this.data.personList.sort(this.listSort('sign'))
        // 一般情况下#分组在最下面,在此做以处理
        if (this.data.personList[0].sign == '#') {
            this.data.personList.splice(0, 1).forEach(item => {
                this.data.personList.push(item)
            })
        }
        this.setData({
            personList
        })
        console.log(personList)
    },
    // 排序
    listSort(prop) {
        return function (a, b) {
            var value1 = a[prop].charCodeAt();
            var value2 = b[prop].charCodeAt();
            return value1 - value2
        }
    },
    // 点击列表中的人员
    choose(e){
        console.log(e.currentTarget.dataset.item)
        let name = e.currentTarget.dataset.item.name
        wx.showToast({
            title: name,
            icon: 'none'
        })
    },
    /**
     * 点击右侧字母
     * 这里使用的是scroll-view中的自身方法,在scroll-view中添加以下属性
     * 1、enable-back-to-top,点击标题回弹
     * 2、scroll-into-view="{{toView}}",滚动到id为toView的位置,动态设置该id即起到切换的左右
     * 3、scroll-y="true",y轴方向滚动
     * 4、scroll-with-animation="true",滚动动画
     * 注:在使用scroll-view时:必须给当前盒子设置固定的高度,否则无法生效
     */
    chooseLetter(e){
        let currentItem = e.currentTarget.dataset.item
        this.data.personList.forEach(item => {
            if (item.sign == currentItem.sign) {
                this.setData({
                    toView: 'inToView' + currentItem.id //滚动条to指定view
                })
            }
        })
    }
})
