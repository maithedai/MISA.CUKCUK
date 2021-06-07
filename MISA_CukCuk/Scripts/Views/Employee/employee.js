
//Trang nhân viên
class EmployeePage extends BaseGrid{

    constructor (gridId) {
        super(gridId);

        this.config();
    }

    /**
     * Hàm cấu hình các url
     * MTDAI 06.06.2021
     */
    config() {
        let me = this,
            config = {
                urlAdd: "v1/Employees",
                urlEdit: "v1/Employees",
                urlDelete: "v1/Employees",
                entityName: "Nhân Viên"
            };
        Object.assign(me, config);
    }

    /**
     * 
     * @param {*} formId 
     */
    initFormDetail(formId, loadId) {
        let me = this;
        me.formDetail = new EmployeeDetail(formId, loadId);
    }

    initDelete(formId) {
        let me = this;
        me.deleteform = new DeleteEmployee(formId);
    }
}

// Khởi tạo đối tượng trang nhân viên
let employeePage = new EmployeePage("#gridEmployee");

// Khởi tạo một form detail
employeePage.initFormDetail("#formEmployeeDetail", "#loader");