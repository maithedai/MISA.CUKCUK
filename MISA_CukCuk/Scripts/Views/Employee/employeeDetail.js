class EmployeeDetail extends BaseForm {
    constructor(formId, loadId) {
        super(formId, loadId)
    }

    /**
     * Hàm xử lí email 
     * MTDAI 06.06.2021
     */
    validateEmail() {
        let me = this,
            isValid = true;

        me.form.find('[FieldName = "Email"]').each(function() {
            let value = $(this).val();
            var at = value.indexOf("@");
            var dot = value.lastIndexOf(".");
            var space = value.indexOf(" ");
            if ((at != -1) && //có ký tự @
                (at != 0) && //ký tự @ không nằm ở vị trí đầu
                (dot != -1) && //có ký tự .
                (dot > at + 1) && (dot < value.length - 1) //phải có ký tự nằm giữa @ và . cuối cùng
                &&
                (space == -1)) //không có khoẳng trắng 
            {
                $(this).removeClass("notValidControl");
                isValid = true;
            } else {
                alert("Email không đúng định dạng");
                $(this).addClass("notValidControl");
                isValid = false;
            }
        });

        return isValid
    }

    /**
     * Hàm kiểm tra số điện thoại
     * MTDAI 06.06.2021
     */
    validatePhoneNumber() {
        let me = this,
            isValid = true;

        me.form.find('[FieldName = "PhoneNumber"]').each(function() {
            let value = $(this).val();
            if (value.length != 10) {
                alert("SĐT không đúng định dạng");
                $(this).addClass("notValidControl");
                isValid = false;
            } else {
                $(this).removeClass("notValidControl");
            }
        })
        return isValid;
    }

    /**
     * Hàm so sánh mã 
     * MTDAI 06.06.2021
     */
    validateCode() {

        let me = this,
            isValid = true,
            control = me.form.find('[FieldName = "EmployeeCode"]'),
            employeeCode = control.val(),
            result = me.getEmployeeByCode(employeeCode);

        if (me.FormMode === Enumeration.FormMode.Add) {
            if (result.length > 0) {
                isValid = false;
            }
        } else {
            if (result.length > 0 && me.Record['EmployeeId'] !== result[0]['EmployeeId']) {
                isValid = false;
            }
        }

        if (!isValid) {
            control.addClass("notValidControl");
            alert('Mã nhân viên bị trùng');
        } else {
            control.removeClass("notValidControl");
        }

        return isValid;
    }

    /**
     * Hàm kiểm tra mã nhân viên trong các bản ghi
     * @param {*} employeeCode 
     * @returns 
     */
    getEmployeeByCode(employeeCode) {
        let me = this,
            result = me.AllRecord.filter(function(item) {
                return item['EmployeeCode'] == employeeCode;
            });

        return result;
    }

    validateCustom() {
        let me = this,
            isValid = true;

        if (isValid) {
            me.validateCode();
        }
        // if (isValid) {
        //     me.validateEmail();
        // }
        // if (isValid) {
        //     isValid = me.validatePhoneNumber();
        // }

        return isValid
    }
}