
// Base Grid chung 
class BaseGrid {

    constructor(gridId) {

        let me = this;

        //lưu lại grid
        me.grid = $(gridId)

        //lấy dữ liệu từ sever
        me.getDataServer();

        //Khởi tạo các sự kiện
        me.initEvents();
    }

    /**
     * Hàm khởi tạo các sự kiện
     * MTDAI 06.06.2021
     */
    initEvents() {
        let me = this;

        // Khởi tạo sự kiện click vào row sẽ đổi background
        me.eventClickRow();

        //Khởi tạo sự kiện click button toolbar
        me.initEventToolbar();

        //Khởi tạo sự kiện click button refresh
        me.refreshPage();
    }

    /**
     * Sự kiện bấm nút Thêm,sửa,xóa,tải lại
     * MTDAI 06.06.2021
     */
    initEventToolbar() {

        let me = this,
            toolbarId = me.grid.attr("Toolbar"),
            toolbar = $(`#${toolbarId}`);

        if (toolbar.length > 0) {
            toolbar.find(".button").on("click", function() {

                let commandType = $(this).attr("CommandType"),
                    fireEvent = null;

                switch (commandType) {
                    case Resource.CommandType.Add: // Thêm mới
                        fireEvent = me.add;
                        break;
                    case Resource.CommandType.Edit: // Sửa
                        fireEvent = me.edit;
                        break;
                    case Resource.CommandType.Delete: // Xóa
                        fireEvent = me.delete;
                        break;
                    case Resource.CommandType.Refresh: // Tải lại
                        fireEvent = me.refresh;
                        break;
                }

                // // Kiểm tra nếu có hàm thì gọi
                if (typeof(fireEvent) == 'function') {
                    fireEvent = fireEvent.bind(me);
                    fireEvent();
                }
            });
        }
    }

    initEventToolbarRefresh() {

        let me = this,
            toolbarId = me.grid.attr("Toolbar"),
            toolbar = $(`#${toolbarId}`);

            if (toolbar.length > 0 && Resource.CommandType.Refresh) {
                toolbar.find(".bo-refresh").on("click", function() {
    
                    let commandType = $(this).attr("CommandType"),
                        fireEvent = null;
    
                    switch (commandType) {
                        
                        case Resource.CommandType.Refresh: // Tải lại
                            fireEvent = me.refresh;
                            break;
                    }
    
                    // // Kiểm tra nếu có hàm thì gọi
                    if (typeof(fireEvent) == 'function') {
                        fireEvent = fireEvent.bind(me);
                        fireEvent();
                    }
                });
            }
    }


    /**
     * Hàm chọn 1 hàng
     * MTDAI 06.06.2021
     */
    eventClickRow() {
        let me = this;

        // Khởi tạo sự kiện click vào row sẽ đổi background
        me.grid.on("click", "tbody tr", function(e) {

            //Nếu là sự kiện ctrl click thì chọn nhiều còn không thì chọn 1 record
            if(`${e.ctrlKey}` == 'false') {

                me.grid.find(".selected-row").removeClass("selected-row");

                //Hàm khi chỉ chọn 1 record sẽ hiển thị button Edit
                $("#toolBarEmployee [CommandType='Edit']").each(function(){
                
                    $(this).removeClass("hide");
                });
            }
            
            $(this).addClass("selected-row");
            // me.hideButtonEdit();
        });
    }

    /**
     * hàm get All Employee từ server
     * MTDAI 06.06.2021
     */
    getDataServer() {
        let me = this,
            url = me.grid.attr("Url"),
            urlFull = `${Constant.UrlPrefix}${url}`;

        // Lên server lấy dữ liệu
        CommonFn.Ajax(urlFull, Resource.Method.Get, {}, function(response) {
            if (response) {
                me.cacheDataGrid = response;
                me.loadData(response);
            } else {
                console.log("Có lỗi lấy dữ liệu từ server");
            }
        });

    }

    /**
     * Hàm dùng để render dữ liệu danh sách nhân viên
     * MTDAI 06.06.2021
     */
    loadData(data) {
        let me = this,
            table = $("<table></table>"),
            thead = me.renderHeader(),
            tbody = me.renderTbody(data);

        table.append(thead);
        table.append(tbody);

        me.grid.find("table").remove();
        me.grid.append(table);

        // Làm một số thứ sau khi binding xong
        me.afterBinding();
    }

    /**
     * Xử lý một số thứ sau khi binding xong
     * MTDAI 06.06.2021
     */
    afterBinding() {
        let me = this;

        // Lấy Id để phân biệt các bản ghi
        me.ItemId = me.grid.attr("ItemId");

        // Mặc định chọn dòng đầu tiên
        me.grid.find("tbody tr").eq(0).addClass("selected-row");

    }

    /**
     * Hàm dùng để render header table
     * MTDAI 06.06.2021
     */
    renderHeader() {
        let me = this,
            thead = $("<thead></thead>"),
            row = $("<tr></tr>");

        // Dyệt các cột để build header
        me.grid.find(".col").each(function() {
            let text = $(this).text(),
                th = $("<th></th>");

            th.text(text);
            row.append(th);
        });

        // Append row vào header
        thead.append(row);

        return thead;
    }

    /**
     * Hàm dùng để render ra tbody
     * @param {Hàm} data 
     * MTDAI 06.06.2021
     */

    renderTbody(data) {
        let me = this,
            tbody = $("<tbody></tbody>");

        if (data && data.length > 0) {
            data.filter(function(item) {
                let row = $("<tr></tr>");

                // Duyệt config từng cột
                me.grid.find(".col").each(function() {
                    let column = $(this),
                        fieldName = column.attr("FieldName"),
                        dataType = column.attr("DataType"),
                        data = item[fieldName],
                        cell = $("<td></td>"),
                        className = me.getClassFormat(dataType),
                        value = me.getValue(data, dataType, column);

                    cell.text(value);
                    cell.addClass(className);
                    row.append(cell);
                });

                // Lưu dữ liệu bản ghi vào tr để sau lấy ra
                row.data("value", item);

                tbody.append(row);
            });
        }
        return tbody;
    }

    /**
     * Hàm lấy dữ liệu từng bản ghi
     * MTDAI 06.06.2021
     * @returns 
     */
    getSelectedRecord() {
        let me = this,
            data = null,
            selected = me.grid.find(".selected-row");

        if (selected.length > 0) {
            data = selected.eq(0).data("value");
        }

        return data;
    }

    /**
     * Hàm lấy class format cho từng kiểu dữ liệu
     * MTDAI 06.06.2021
     * @param {Hàm} dataType 
     */
    getClassFormat(dataType) {
        let me = this,
            className = "";

        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                className = "align-right";
                break;
            case Resource.DataTypeColumn.Date:
                className = "align-center";
                break;
        }

        return className;
    }

    /**
     * Hàm lấy dữ liệu chuẩn hóa
     * MTDAI 06.06.2021
     * @param {Hàm} dataType 
     */
     getValue(data, dataType, column) {
        let me = this;

        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                data = CommonFn.formatMoney(data);
                break;
            case Resource.DataTypeColumn.Date:
                data = CommonFn.formatDate(data);
                break;
            case Resource.DataTypeColumn.Enum:
                let enumName = column.attr("EnumName");
                data = CommonFn.getValueEnum(data, enumName);
                break;
        }
        return data;
    }

    
    /**
     * Hàm click refresh để load lại trang 
     */
    refreshPage() {

        let me = this;
        // debugger
        $(".bo-refresh").on("click", function() {
            me.refresh();
        })

    }

    /**
     * Hàm thêm mới dữ liệu
     * MTDAI 07.06.2021
     */
    add() {
        let me = this,
            param = {
                Parent: me,
                FormMode: Enumeration.FormMode.Add,
                Record: {...me.getSelectedRecord() },
                AllRecord: me.cacheDataGrid,
            };
        
        if (me.formDetail) {
            me.formDetail.open(param);
        }
    }

    /**
     * Hàm refresh lại trang
     * MTDAI 06.06.2021
     */
    refresh() {
        let me = this;
        if (me.formDetail)
            me.formDetail.loading();
        me.getDataServer();
    }

}