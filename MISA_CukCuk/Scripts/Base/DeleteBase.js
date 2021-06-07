class DeleteBase {
    constructor(formId) {
        let me = this;

        me.form = $(`${formId}`);

        me.initEvent();
    }

    /**
     * Hàm khởi tạo các event
     * Ngọc 6-2-2021 
     */
    initEvent() {
        let me = this;

        me.eventOnClick();
        me.titleClick();
        me.draggableForm();
    }

    /**
     * Hàm cho phép kép thả form
     */
    draggableForm() {
        let me = this;

        me.form.draggable({ handle: ".dialog-title" });

    }


    /**
     * Event dấu X dc click
     */
    titleClick() {
        let me = this;

        me.form.find('.close-button').on('click', function() {
            me.cancel();
        });
    }

    //Event Xóa or Hủy dc click
    eventOnClick() {
        let me = this;
        me.form.find('.btnForm').on('click', function() {
            let command = $(this).attr('Command');

            switch (command) {
                case Resource.CommandForm.Confirm:
                    me.confirm();
                    break;
                case Resource.CommandForm.Cancel:
                    me.cancel();
                    break
            }
        });
    }

    confirm() {
        let me = this,
            data = me.Record;

        me.excuteDelete(data);
    }

    /**
     * Hàm xóa data
     * @param {*} data 
     */
    excuteDelete(data) {
        let me = this,
            url = `${me.Parent.urlDelete}/${data[me.ItemId]}`,
            method = Resource.Method.Delete,
            urlFull = `${Constant.UrlPrefix}${url}`;

        CommonFn.Ajax(urlFull, method, data, function(respone) {

            if (respone) {
                alert('Xóa dữ liệu thành công');
                me.cancel();
                me.Parent.refresh();
            } else {
                alert('Xóa dữ liệu lỗi');
            }
        })
    }

    /**
     * Hàm mở form xác nhận
     * @param {*} param 
     */
    open(param) {
        let me = this;

        Object.assign(me, param);

        if (!me.EntityName) {
            alert("Chưa cấu hình entityName");
        } else {
            me.show();
        }

    }

    /**
     * Hàm mở form xác nhận
     * @param {*} param 
     */
    show() {
        let me = this;

        me.form.find(".Tittle-text").text(`Xóa ${me.EntityName}`);
        me.form.show();
    }

    /**
     * Hàm mở ẩn xác nhận
     * MTDAI 06.06.2021
     */
    cancel() {
        let me = this;

        me.form.hide();
    }
}