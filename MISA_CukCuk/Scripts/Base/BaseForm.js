class BaseForm {
    constructor(formId, loadId) {
        let me = this;

        me.form = $(`${formId}`);
        me.load = $(`${loadId}`);

        // Khởi tạo các sự kiện
        me.initEvents();
    }

    /**
     *  Hàm khởi tạo các sự kiện
     * MTDAI 06.06.2021
     */
    initEvents() {
            let me = this;
            me.initEventButtonClick();
        }
        /**
         * Hàm bắt sự kiên bấm lưu,hủy
         * MTDAI 06.06.2021
         */
    initEventButtonClick() {
        let me = this;

        me.form.find(".button").on("click", function() {
            let command = $(this).attr("Command");
            switch (command) {
                case Resource.CommandForm.Save:
                    me.save();
                    break;
                case Resource.CommandForm.Cancel:
                    me.cancel();
                    break;
            }
        })

        //Hàm ẩn form chi tiết khi click dấu x
        me.form.find(".formContent-close").on("click", function() {
            let command = $(this).attr("Command");
            if (command && Resource.CommandForm.Cancel) {
                me.cancel();
            }
        })
    }

    

    /**
     * Hàm kiểm tra và lưu dữ liệu
     * MTDAI 06.06.2021
     */
    save() {
        let me = this,
            isValid = me.validateForm();

        if (isValid) {
            let data = me.getDataForm();
            me.saveData(data);
        }
    }

    /**
     * Lưu dữ liệu 
     * MTDAI 06.06.2021
     */
    saveData(data) {
        let me = this,
            url = me.Parent.urlAdd,
            method = Resource.Method.Post,
            urlFull = `${Constant.UrlPrefix}${url}`;

        // Nếu edit thì sửa lại
        if (me.FormMode == Enumeration.FormMode.Edit) {
            url = `${me.Parent.urlEdit}/${data[me.ItemId]}`;
            method = Resource.Method.Put;
            urlFull = `${Constant.UrlPrefix}${url}`;
        }

        // Gọi lên server cất dữ liệu
        CommonFn.Ajax(urlFull, method, data, function(response) {
            if (response) {
                console.log("Cất dữ liệu thành công");

                me.cancel();
                me.loading();
                me.Parent.getDataServer();
            } else {
                console.log("Có lỗi khi cất dữ liệu");
            }
        });
    }

    /**
     * Lấy dữ liệu form r chuyển thành dữ liệu thô
     * MTDAI 06.06.2021
     */
    getDataForm() {
        let me = this,
            data = me.Record || {};

        me.form.find("[FieldName]").each(function() {
            let control = $(this),
                dataType = control.attr("DataType"),
                fieldName = control.attr("FieldName"),
                value = me.getValueControl(control, dataType);
            data[fieldName] = value;
        });

        return data;
    }

    /**
     * Lấy dữ liệu từng ô trong form dựa vào dataType
     * MTDAI 06.06.2021
     */

    getValueControl(control, dataType) {
        let me = this,
            value = control.val();

        switch (dataType) {
            case Resource.DataTypeColumn.Date:
                value = new Date(value);
                break;
            case Resource.DataTypeColumn.Number:
                value = parseInt(value);
                break;
            case Resource.DataTypeColumn.Enum:
                value = value != null? Constant.Gender[value]: null;
                break;
        }

        return value;
    }

    /**
     * Hàm kiển tra dữ liệu
     * MTDAI 06.06.2021
     */
    validateForm() {
        let me = this,
            isValid = me.validateRequire();

        if (isValid) {
            isValid = me.validateFieldNumber();
        }

        if (isValid) {
            isValid = me.validateFieldDate();
        }

        if (isValid) {
            isValid = me.validateCustom();
        }
        return isValid;
    }


    /**
     * 
     * @returns 
     */
    validateCustom() {
        return true;
    }

    // Validate các trường bắt buộc
    validateRequire() {
        let me = this,
            isValid = true;

        // Duyệt hết các trường require xem có trường nào bắt buộc mà ko có value ko
        me.form.find("[Require='true']").each(function() {
            let value = $(this).val();

            if (!value) {
                isValid = false;

                $(this).addClass("notValidControl");
                $(this).attr("title", "Vui lòng không được để trống!");
            } else {
                $(this).removeClass("notValidControl");
            }
        });

        return isValid;
    }

    // Validate các trường Number
    validateFieldNumber() {
        let me = this,
            isValid = true;

        // Duyệt hết các trường require xem có trường nào bắt buộc mà ko có value ko
        me.form.find("[DataType='Number']").each(function() {
            let value = $(this).val();

            // is not a number
            if (isNaN(value)) {
                isValid = false;

                $(this).addClass("notValidControl");
                $(this).attr("title", "Vui lòng nhập đúng định dạng!");
            } else {
                $(this).removeClass("notValidControl");
            }
        });

        return isValid;
    }

    // Validate các trường ngày tháng
    validateFieldDate() {
        let me = this,
            isValid = true;

        // Duyệt hết các trường require xem có trường nào bắt buộc mà ko có value ko
        // me.form.find("[DataType='Date']").each(function() {
        //     let value = $(this).val();

        //     // is not a number
        //     if (!CommonFn.isDateFormat(value)) {
        //         isValid = false;

        //         $(this).addClass("notValidControl");
        //         $(this).attr("title", "Vui lòng nhập đúng định dạng!");
        //     } else {
        //         $(this).removeClass("notValidControl");
        //     }
        // });

        return isValid;
    }

    /**
     * Hàm mở loader
     * MTDAI 06.06.2021
     */
    loading() {
        debugger
        let me = this;
        me.load.show();
        $('.wrapper').addClass('fade');
        setTimeout(function() {
            me.load.hide();
            $('.wrapper').removeClass('fade');
        }, 2000);
    }

    /**
     * Hàm mở form
     * MTDAI 06.06.2021
     */
    open(param) {
        let me = this;

        Object.assign(me, param);

        me.show();

        if (me.FormMode == Enumeration.FormMode.Edit) {
            me.bindingData(me.Record);
        }
    }

    /**
     * chuyển dữ liệu từ data thô của hàng vào form
     * MTDAI 06.06.2021
     */
    bindingData(data) {
        let me = this;

        me.form.find("[FieldName]").each(function() {
            let control = $(this),
                fieldName = control.attr("FieldName"),
                dataType = control.attr("DataType"),
                value = data[fieldName];

            me.setValueControl(control, value, dataType);
        });
    }

    /**
     * chuyển dữ liệu vào từng ô trong form
     * MTDAI 06.06.2021 
     */
    setValueControl(control, value, dataType) {
        let me = this;

        switch (dataType) {
            case Resource.DataTypeColumn.Date:
                value = CommonFn.convertDate(value);
                break;
        }
        control.val(value);
    }

    /**
     * Hiển thị form
     * MTDAI 06.06.2021
     * Hàm khi add hoặc edit sẽ Focus vao form đầu tiên
     */
    show() {
        let me = this;

        
        me.form.show();
        me.form.find('[FieldName = "EmployeeCode"]').focus();

        // reset dữ liệu
        me.resetForm();
    }

    /**
     * Hàm tải lại form
     * MTDAI 06.06.2021
     */
    resetForm() {
        let me = this;

        // reset dữ liệu về rỗng
        me.form.find("[FieldName]").val("");

        me.form.find(".notValidControl").removeClass("notValidControl");
    }

    /**
     * Hàm ẩn form
     * MTDAI 06.06.2021
     */
    cancel() {
        let me = this;

        me.form.hide();
    }
}