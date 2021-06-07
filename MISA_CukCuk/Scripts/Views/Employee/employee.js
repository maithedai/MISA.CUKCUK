
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

$(document).ready(function(){

    /**
     * Sự kiện show dropdown
     * MTDAI 07.06.2021
     */
    $(".pn-department .input-field .arrow").on("click", function(e){
        let $item = $(this),
            
            $drDown = $(".pn-department .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });

    $(".pn-location .input-field .arrow").on("click", function(e){
        let $item = $(this),
            
            $drDown = $(".pn-location .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });


    /**
     * Sự kiện show dropdown trong form detail
     * MTDAI 07.06.2021
     */
    $(".pn-gender .input-field .arrow-form").on("click", function(e){
        let $item = $(this),
            $drDown = $(".pn-gender .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });

    $(".pn-department-form .input-field .arrow-form").on("click", function(e){
        let $item = $(this),
            $drDown = $(".pn-department-form  .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });

    $(".pn-job .input-field .arrow-form").on("click", function(e){
        let $item = $(this),
            $drDown = $(".pn-job .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });

    $(".pn-workstatus .input-field .arrow-form").on("click", function(e){
        let $item = $(this),
            $drDown = $(".pn-workstatus .drop-down");
            
        if($item.hasClass("down")){
            $item.removeClass("down");
            $drDown.hide();
        }else{
            $item.addClass("down");
            $drDown.show();
        }
        
    });

    /**
     * Sự kiện click item chọn
     */
    $(".drop-down .dr-item").on("click", function(e) {
        let $item = $(this),
            val = $item.find(".text").text(),
            $parent = $item.parents('.content-control'),
            $cboDate = $parent.find("#cboDate");
            //bỏ active
            $item.parents(".drop-down").find(".dr-item").removeClass("active");

            //Gán giá trị cho input
            $cboDate.val(val);
            
            //addclass active cho element
            $item.addClass("active");

            //show item clear
            $parent.find('.btn-clear').show();
    });

    /**
     * Sự kiện click ô clear text input
     */
    $('.input-field .btn-clear').on("click", function(){
        let $item = $(this),
            $parent = $item.parents('.content-control');

        //Bỏ active item drop down
        $parent.find(".drop-down .dr-item").removeClass("active");
        //xóa giá trị ô input
        $parent.find("#cboDate").val("");
        //Ẩn nút clear
        $item.hide();
    });

    /**
     * Ẩn dropdown khi click ra ngoài button arrow
     */
    $(document).on("click", function(e){
        let $el = $(e.target),
            isArrow = $el.data("arrow"); //đây là cách lấy attribute data- mà jquery cung cấp để thao tác với element

        //Nếu không phải class arrow => hide dropdown
        if(!isArrow){
            $(".content-control .drop-down").hide();
            $(".content-control .arrow").removeClass("down");
        }
    })
});