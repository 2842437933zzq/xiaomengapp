$(function () {
    //图片的基本路径
    var baseUrl = './images/';

    //配置天气图标
    var forecastIcons = {

        yun: {
            title: '多云',
            icon: 'yun.png'
        },

        da: {
            title: '大雨',
            icon: 'da.png'
        },

        lei: {
            title: '雷阵雨',
            icon: 'lei.png'
        },

        qing: {
            title: '晴',
            icon: 'qing.png'
        },

        yu: {
            title: '小雨',
            icon: 'xiao.png'
        },
        zhen: {
            title: '阵雨',
            icon: 'zhen.png'
        },

        zhong: {
            title: '中雨',
            icon: 'zhong.png'
        },


        //未知天气的图标
        default: {
            title: '未知',
            icon: ''
        }
    }


    //获取天气的情况
    function getForecastData(city) {

        var data = {
            appid: '77227634',
            appsecret: '62wfrfom',
            version: 'v6',
        };

        if (city !== undefined) {
            data.city = city;
        }

        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api',
            data: data,
            dataType: 'jsonp',
            success: function (data) {
                // console.log('data ==> ', data);
                //获取定位位置
                $('.my-city').text(data.city);
                //获取本天天气
                var forecastData = ['date', 'week', 'tem', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];
                for (var i = 0; i < forecastData.length; i++) {
                    if (forecastData[i] === 'wea') {
                        $('.' + forecastData[i]).css({
                            backgroundImage: 'url(' + baseUrl + (forecastIcons[data.wea_img] == undefined ? forecastIcons.default : forecastIcons[data.wea_img]).icon + ')',
                        });
                    } else {
                        $('.' + forecastData[i]).text(forecastData[i] === 'tem' ? data[forecastData[i]] + '℃' : data[forecastData[i]]);
                    }

                }

                //获取24小时天气和未来六天的天气情况
                var times = {
                    appid: '77227634',
                    appsecret: '62wfrfom',
                    version: 'v9',
                };
                if (city !== undefined) {
                    times.city = city;
                }
                $.ajax({
                    type: 'GET',
                    url: 'https://www.tianqiapi.com/api',
                    data: times,
                    dataType: 'jsonp',
                    success: function (then) {
                        // console.log('then ==> ',then);
                        //绑定24小时天气数据
                        var hoursForecastData = then.data[0].hours;

                        $.each(hoursForecastData, function (i, v) {

                            var $li = $(`<li>
                      <div>${v.hours}</div>
                      <div class="hora-forecast-icon" style="background-image: url('${baseUrl + (forecastIcons[v.wea_img] == undefined ? forecastIcons.default : forecastIcons[v.wea_img]).icon}')"></div>
                      <div>${v.tem}℃</div>
                      <div>${v.win}</div>
                    </li>`);
                            $('#horaForecast').append($li);
                        })

                        //未来六天预报
                        var tailforecastData = then.data.slice(1);
                        console.log('tailforecastData ==> ', tailforecastData);

                        $.each(tailforecastData, function (i, v) {
                            var $li = $(`<li class="clearfix">
                                      <span>${v.day.replace(/（星期[一二三四五六日]）/, '')}</span>
                                      <span>
                                        <i class="hora-forecast-icon" style="background-image: url('${baseUrl + (forecastIcons[v.wea_img] == undefined ? forecastIcons.default : forecastIcons[v.wea_img]).icon}')"></i>
                                      </span>
                                      <span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
                                      <span class="f-dir">${v.win[1]}</span>
                                    </li>`);
                            $('.tailForecast').append($li);
                        })
                    }
                })
            }
        })
    }
    getForecastData();
    //搜素
    $('.search-icon').on('click',function () {

        var city =$('.inp-box').val();

        if(city == undefined || city.trim() == '') {
            return;
        }
        // console.log(city);

$('#horaForecast,.tailForecast').empty();

getForecastData(city);
    })
})