require(["./config"], function() {
    require(["bscroll", "mui", "removeItem", "muipicker"], function(BScroll, mui, removeItem, muipicker) {
        mui.init();
        init();
        var dtPickerM = new mui.DtPicker({ type: "month" });
        var dtPickerA = new mui.DtPicker({ type: "aa" });
        var picker = new mui.PopPicker();
        picker.setData([{ value: 'month', text: '月' }, { value: 'aa', text: '年' }]);

        function init() {
            render();
            selectBill();
            selectType();
            toAdd();
            removeBill();
        }

        function toAdd() {
            addBill.addEventListener("tap", function() {
                location.href = "addbill.html";
            })
        }

        function render() {
            mui.ajax("/bill/bill", {
                type: "post",
                data: {
                    uid: "5c34400da2f75e2e00b7eae1"
                },
                success: function(result) {
                    renderBill(result);
                }
            })

            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            month = month < 10 ? "-0" + month : "-" + month;
            setYear.innerHTML = year;
            setMonth.innerHTML = month;

        }

        function dtPickerShow(dtPicker, type) {
            dtPicker.show(function(selectItems) {
                // console.log(selectItems.m);
                var _type = type;
                var obj = {};
                if (_type == "month") {
                    obj.year = selectItems.y.text;
                    obj.month = selectItems.m.text;
                    setYear.innerHTML = selectItems.y.text;
                    setMonth.innerHTML = "-" + selectItems.m.text;
                } else {
                    obj.year = selectItems.y.text;
                    setYear.innerHTML = selectItems.y.text;
                }
                console.log(obj);
                obj.uid = "5c34400da2f75e2e00b7eae1";
                mui.ajax("/bill/bill", {
                    type: "post",
                    data: obj,
                    success: function(result) {
                        console.log(result);
                        renderBill(result);
                    }
                })

            })
        }

        function selectBill() {
            setBtn.addEventListener("tap", function() {
                if (this.dataset.type == "month") {
                    dtPickerShow(dtPickerM, this.dataset.type);
                } else {
                    dtPickerShow(dtPickerA, this.dataset.type);
                }
            })
        }

        function selectType() {
            setType.addEventListener("tap", function() {
                picker.show(function(selectItems) {
                    setBtn.dataset.type = selectItems[0].value;
                    checkType.innerHTML = selectItems[0].text;
                    if (selectItems[0].value == "month") {
                        var time = new Date();
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        month = month < 10 ? "-0" + month : "-" + month;
                        setYear.innerHTML = year;
                        setMonth.innerHTML = month;
                    } else {
                        setMonth.innerHTML = "";
                    }
                    picker.dispose();
                    picker = null;
                })
            })
        }


        function renderBill(result) {
            var str = "";
            var arrSort = result.msg.sort(function(a, b) {
                return b.timer * 1 - a.timer * 1;
            })

            var data = {};
            var arr = [];
            var zcall = 0;
            var srall = 0;
            arrSort.forEach(function(file) {
                if (arr.indexOf(file.timer) == -1) {
                    data[file.timer] = [];
                    arr.push(file.timer);
                }
                data[file.timer].push(file);
            })
            arr.forEach(function(file) {
                var curstr = "";
                var money = 0;
                data[file].forEach(function(data) {
                    if (data.type == "支出") {
                        money += data.money * 1;
                        zcall += data.money * 1;
                    } else {
                        money -= data.money * 1;
                        srall += data.money * 1;
                    }

                    curstr += `<li class="mui-table-view-cell bill-item">
                                        <div class="mui-slider-right mui-disabled">
                                            <a class="mui-btn mui-btn-red" data-id=${data._id}>删除</a>
                                        </div>
                                        <div class="mui-slider-handle">
                                            <p>
                                                <span class="mui-icon mui-icon-weixin"></span>
                                                <span>${data.title}</span>
                                            </p>
                                            <p class=${data.type == "收入" ? "current" : ""}>${data.money.split(".")[1] ?data.money.split(".")[1].length ==1 ?data.money +"0" :data.money :data.money + ".00"}</p>
                                        </div>
                                    </li>`;

                })

                str += `<div class="title">
                                        <p>
                                            <span>${file.substr(4,2)}</span>月
                                            <span>${file.substr(6,2)}</span>日
                                        </p>
                                        <p>
                                            <span>${money<0 ? "收入":"支出" }</span>
                                            <span class=${money<0 ? "current":"" }>${money<0 ? -money+".00":money+".00"}</span>
                                        </p>
                                    </div>`;
                str += curstr;

            })
            console.log(zcall, srall);
            zcAll.innerHTML = zcall.toString().split(".")[0];
            zcAlldian.innerHTML = zcall.toString().split(".")[1] ? zcall.toString().split(".")[1] : ".00";
            if (!srall.toString().split(".")[1]) {
                srall += ".00";
            } else if (srall.toString().split(".")[1].length == 1) {
                srall += "0";
            }
            srAll.innerHTML = srall;
            jieyunum = (srall * 100 - zcall * 100) / 100;
            if (!jieyunum.toString().split(".")[1]) {
                jieyunum += ".00";
            } else if (jieyunum.toString().split(".")[1].length == 1) {
                jieyunum += "0";
            }
            jieyu.innerHTML = jieyunum;
            OA_task_1.innerHTML = str;
        }

        function removeBill() {
            console.log(11111);
            mui("#OA_task_1").on("tap", ".mui-btn-red", function() {
                var configbtn = document.getElementsByClassName("mui-popup-button")[0];
                configbtn.setAttribute("data-id", this.getAttribute("data-id"));
            })
        }
        console.log(document.querySelector(".mui-ios"));
        mui(".mui-ios").on("tap", ".mui-popup-button", function() {
            if (!this.classList.contains("mui-popup-button-bold")) {
                console.log(this.getAttribute("data-id"));
                var obj = { id: this.getAttribute("data-id") };
                mui.ajax("/bill/billDelete", {
                    data: obj,
                    type: "post",
                    success: function(data) {
                        console.log(data);
                        if (data.code == 1) {
                            mui.alert(data.msg, function() {

                            })
                        }
                    }
                })
            }
        })

    })
})