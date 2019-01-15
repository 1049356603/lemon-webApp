require(["./config"], function() {
    require(["bscroll", "mui", "removeItem", "muipicker"], function(BScroll, mui, removeItem, muipicker) {

        mui.init({
            swipeBack: false
        });
        mui('.mui-scroll-wrapper').scroll({
            indicators: true //是否显示滚动条
        });
        render();
        setType();
        keyboard.addEventListener('tap', function(e) {
            var moneyVal = moneyNum.value;
            var target = e.target;
            if (target.classList.contains("num")) {
                var text = target.innerHTML;
                if (moneyVal == "0.00" || moneyVal == "0") {
                    moneyNum.value = text;
                } else {
                    if (moneyVal.length > 10) {} else if (moneyVal.indexOf(".") > -1 && moneyVal.indexOf(".") < moneyVal.length - 2) {} else {
                        moneyNum.value += text;
                    }
                }

            } else if (target.classList.contains("remove")) {
                console.log("remove");
                moneyNum.value = moneyVal.substr(0, moneyVal.length - 1) == "" ? "0" : moneyVal.substr(0, moneyVal.length - 1);

            } else if (target.classList.contains("confirm")) {
                var uid = "5c34400da2f75e2e00b7eae1";
                console.log(document.querySelector(".mui-slider-group .active").parentNode);
                var cid = document.querySelector(".mui-slider-group .mui-active .active").parentNode.getAttribute("data-id");
                var type1 = document.querySelector("#tab .mui-active").getAttribute("data-id");
                var time = new Date();
                var year = time.getFullYear();
                var day = time.getDate();
                var month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;

                var timer = "" + year + month + day;
                var money = moneyNum.value;
                var title = btitle.value;
                console.log(uid, cid, type1, timer, money, title);
                mui.ajax("/bill/billAdd", {
                    data: {
                        uid: uid,
                        cid: cid,
                        "type": type1,
                        timer: timer,
                        money: money,
                        title: title
                    },
                    type: "post",
                    success: function(data) {
                        console.log(data);
                        if (data.code == 1) {
                            mui.alert("添加成功", function() {
                                location.href = "/";
                            })
                        }
                    }
                })
            } else if (target.classList.contains("dian")) {
                if (moneyVal.indexOf(".") == -1) {
                    moneyNum.value += ".";
                }

            }
        }, false)

        function render() {
            mui.ajax("/classify/classifyget", {
                type: "post",
                success: function(result) {
                    if (result.code == 1) {
                        var data = result.msg
                        var strZ = "";
                        var strS = "";
                        var falgZ = false;
                        var falgS = false;

                        data.forEach(function(file, ind) {
                            var oclass = "";
                            if (file.c_type == "支出" && falgZ == false) {
                                oclass = "active";
                                falgZ = true;
                            } else if (file.c_type == "收入" && falgS == false) {
                                oclass = "active";
                                falgS = true;
                            }
                            var str = `<dl data-type=${file.c_type} data-id=${file._id}>
                                         <dt class='${oclass}'>
                                         <span class="${file.c_icon}"></span>
                                         </dt>
                                        <dd>${file.c_name}</dd>
                                        </dl>`;
                            if (file.c_type == "支出") {
                                strZ += str;
                            } else if (file.c_type == "收入") {
                                strS += str;
                            }
                        })
                        zBox.innerHTML = strZ;
                        sBox.innerHTML = strS;
                    }
                }
            })
        }

        function setType() {
            mui("#zBox").on("tap", "dl", function() {
                var dlList = zBox.childNodes;
                console.log(dlList);
                for (var i = 0; i < dlList.length; i++) {

                    dlList[i].firstElementChild.classList.remove("active");
                }
                this.firstElementChild.classList.add("active");
            })
            mui("#sBox").on("tap", "dl", function() {
                var dlList = sBox.childNodes;
                console.log(dlList);
                for (var i = 0; i < dlList.length; i++) {
                    dlList[i].firstElementChild.classList.remove("active");
                }
                this.firstElementChild.classList.add("active");

            })


        }


    })
})