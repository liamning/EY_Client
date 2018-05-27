/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
const host = window.host; //"http://localhost:8088";


var validation = { number: /\d+(\.\d{1,2})?/g, email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ }
var my_dtOptions = function (DTOptionsBuilder) {
    var dtOptions = DTOptionsBuilder.newOptions()
        .withLanguage({
            "sEmptyTable": "没有纪录",
            "sInfo": "第_START_-_END_条记录, 总共_TOTAL_条记录",
            "sInfoEmpty": "",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "显示 _MENU_ 条记录",
            "sLoadingRecords": "Loading...",
            "sProcessing": "Processing...",
            "sSearch": "搜索",
            "sZeroRecords": "No matching records found",
            "oPaginate": {
                "sFirst": "First",
                "sLast": "Last",
                "sNext": "下一页",
                "sPrevious": "上一页"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        });

    return dtOptions;

}
var simple_dtOptions = function (DTOptionsBuilder) {

    var dtOptions = DTOptionsBuilder.newOptions()
        .withLanguage({
            "sEmptyTable": "没有纪录",
            "sInfo": "第_START_-_END_条记录, 总共_TOTAL_条记录",
            "sInfoEmpty": "",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "显示 _MENU_ 条记录",
            "sLoadingRecords": "Loading...",
            "sProcessing": "Processing...",
            "sSearch": "搜索",
            "sZeroRecords": "No matching records found",
            "oPaginate": {
                "sFirst": "First",
                "sLast": "Last",
                "sNext": "下一页",
                "sPrevious": "上一页"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        }).withOption('bFilter', false).withOption('lengthChange', false);

    return dtOptions;

}

export function MainCtrl($scope, $http, $state, $rootScope, $locale, $timeout, DTOptionsBuilder) {

    $rootScope.host = host;

    $rootScope.GlobalSetting = {
        NoRecordFound: "没有纪录"
    }

    $rootScope.loginInfo = { ...$rootScope.loginInfo, ...window.loginInfo };

    //console.log($rootScope.loginInfo);
    $rootScope.number = validation.number;
    $rootScope.email = validation.email;

    $scope.refresh_ui_select_list = {};
    $scope.refresh_ui_select = function (table, input, limit, includeInput, callback) {
        if (limit && (!input || input.length < limit)) return;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "refreshList", Table: table, Input: input }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {

            response = response.data;
            // //console.log('refresh_ui_select [' + table + '] [Done].');

            if (response) {
                $scope.refresh_ui_select_list[table] = response;
                if (response && input && includeInput)
                    response.unshift({
                        'Code': input,
                        'Desc': input,
                    });
            }
            if (callback)
                callback(response);
        });

    }
    $scope.ui_select_change = function (table) {
        $scope.refresh_ui_select_list[table].length = 0;
    }


    $rootScope.loginInfo.generalMaster = {};
    $rootScope.generalMaster = function (category) {

        if (!$rootScope.loginInfo.generalMaster[category]) {
            $rootScope.loginInfo.generalMaster[category] = [];
        }
        return $rootScope.loginInfo.generalMaster[category];

    }
    $rootScope.getGeneralMasterList = function (callback) {

        var categoriesList = [];
        for (var pro in $rootScope.loginInfo.generalMaster) {
            if (pro && !$rootScope.loginInfo.generalMaster[pro].length) {
                categoriesList.push(pro);
            }
        }

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getGeneralMasterList", categories: JSON.stringify(categoriesList) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                for (pro in response) {

                    $rootScope.loginInfo.generalMaster[pro] = response[pro];
                    //console.log('getGeneralMasterList [' + pro + '] [Done].');
                    //console.log($rootScope.loginInfo.generalMaster);
                }
            }

            if (callback)
                callback(response);
        });
    }

    $locale.NUMBER_FORMATS.GROUP_SEP = ',';
    $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';

    //data table setup
    $scope.dtOptions = my_dtOptions(DTOptionsBuilder);
    $scope.dt_simple_Options = simple_dtOptions(DTOptionsBuilder);

    $scope.getClientResponsibilityType = function ($state, $rootScope, $http) {

        // if (!$state.params.ID) {
        //     $rootScope.islawyer = undefined;
        //     return;
        // }
        // if ($rootScope.islawyer) return;


        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getResponsibilityType",
                ClientID: $rootScope.loginInfo.currentClientID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                $rootScope.islawyer = response.ResponsibilityType == 3;
            }
        });


    }
};

export function LoginCtrl($scope, $http, $rootScope, $state) {


    $scope.loginObj = {};
    $scope.loginObj.UserCode = "";
    $scope.loginObj.Password = "";

    $scope.login = function () {

        $http({

            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/LoginHandler.ashx',
            data: $.param({
                action: "login",
                StaffNo: $scope.loginObj.UserCode,
                Password: $scope.loginObj.Password
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response.result == "1") {
                $scope.loginInfo.UserID = $scope.loginObj.UserCode;
                $scope.loginInfo.Role = response.role;
                $state.go('index.ClientInquiry');

            } else {
                //toastr.error("使用者名称或密码错误")
                alert("使用者名称或密码错误");
            }
        });
    }
}

export function TopBarCtrl($scope, $http, $state, $rootScope, $stateParams) {



    $scope.init = function () {
        // var tmpUrl = window.location.href.replace(window.location.origin + "/#!/index/", '');
        // var tmpUrl = "index." + tmpUrl.split("/")[0];
        // $("#link a").removeClass("active");
        // $("#link a[name='" + tmpUrl + "']").addClass("active");

        // //console.log($state.current);
        // //console.log($state.current.name);



        angular.element(document).ready(function () {

            if ($rootScope.loginInfo.currentClientID) {

                var stateNameArray = $state.current.name.split('.');
                $("#link a").removeClass("active");
                $("#link a[name='" + stateNameArray[1] + "']").addClass("active");
            }

        });


    }


    // $rootScope.$on('$stateChangeStart', function (e, toState) {
    //     $("#link a").removeClass("active");
    //     $("#link a[name='" + toState.name + "']").addClass("active");
    // })

    // $rootScope.$on('$stateChangeSuccess', function (e, toState) {
    //     $scope.getClientResponsibilityType($state, $rootScope, $http);

    //     //refreshHandle($stateParams, $rootScope);
    // });

    // $scope.getClientResponsibilityType($state, $rootScope, $http);

};

export function ClientInquiryCtrl($scope, $rootScope, $http, $state, DTColumnBuilder) {
    var vm = this;

    $rootScope.loginInfo.currentClientID = undefined;

    function NewClientInquiryObj() {
        return {
        };
    }

    (function () {
        $scope.ClientInquiryObj = NewClientInquiryObj();

    })();

    //data table
    (function () {

        var rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            $('td', nRow).unbind('dblclick').bind('dblclick', function () {
                $scope.$apply(function () {
                    $state.go("index.Client", { ID: aData.ClientID })
                });
            });
            return nRow;
        };

        $scope.dt_simple_Options.withOption('rowCallback', rowCallback)

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('ClientID').withTitle('客户编号'),
            DTColumnBuilder.newColumn('CompanyName').withTitle('公司名称'),
            DTColumnBuilder.newColumn('CompanyType').withTitle('公司类别'),
        ];
        $scope.dtInstance = {};

    })();


    $scope.search = function () {

        var criteria = {};
        angular.copy($scope.ClientInquiryObj, criteria)
        // //console.log(criteria);

        if (criteria.ClientID == "ALL") criteria.ClientID = "";

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "searchClient",
                Criteria: JSON.stringify(criteria),
                FieldsDataType: JSON.stringify({
                    ClientID: 'string',
                    CompanyName: 'string',
                    CompanyType: 'string',
                    RegNo: 'string',
                    TaxCodeNo: 'string',
                    ExternalDebtNo: 'string',
                    Director: 'string',
                    ContactEmail: 'string',
                    LegalRepresentative: 'string',
                }),
                FieldsOperator: JSON.stringify({
                    ClientID: 'equal',
                    CompanyName: 'like',
                    CompanyType: 'like',
                    RegNo: 'like',
                    TaxCodeNo: 'like',
                    ExternalDebtNo: 'like',
                    Director: 'like',
                    ContactEmail: 'like',
                    LegalRepresentative: 'like',
                }),
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                if (response.message)
                    alert(response.message);

                var result = response.ClientList;

                $scope.dtInstance.DataTable.clear();
                $scope.dtInstance.DataTable.rows.add(result).draw();
            }
        });

    }
    $scope.reset = function () {

        $scope.ClientInquiryObj = NewClientInquiryObj();

    }
}

export function StaffProfileCtrl($scope, $http, $timeout, $interval, toastr) {

    var vm = this;

    //object initialization
    (function () {

        $scope.sampleObj = {
        };

        vm.staffNoArray = [];
        vm.refreshStaffNo = function (StaffNo) {

            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getStaffNoList", StaffNo: StaffNo }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;

                ////console.log(response);
                var result = response;
                if (StaffNo)
                    result.unshift(StaffNo);
                vm.staffNoArray = result;

                if ($scope.userForm)
                    $scope.userForm.$setPristine();
            });


        };


    })();

    //event  
    $scope.save = function () {

        if ($scope.userForm.$invalid) return;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "saveStaff",
                StaffInfo: JSON.stringify($scope.sampleObj)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            toastr.success(response.message, "成功");
            ////console.log("success");
        });

    };

    $scope.delete = function () {

        if (!$scope.sampleObj.StaffNo) return;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "deleteStaff",
                StaffNo: $scope.sampleObj.StaffNo
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            toastr.success(response.message, "成功");
            ////console.log("success");
        });
    };

    $scope.staffNoChange = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getStaff", StaffNo: $scope.sampleObj.StaffNo }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response)
                $scope.sampleObj = response;
            else {
                confirm("Confirm to Create a new record?")
                $scope.sampleObj = {
                    StaffNo: $scope.sampleObj.StaffNo,
                    Password: $scope.sampleObj.StaffNo,
                };
            }

        });

    }

}

export function ResetPasswordCtrl($scope, $http, $timeout, $interval, toastr) {

    var vm = this;

    //object initialization
    (function () {

        $scope.sampleObj = {
        };


        vm.staffNoArray = [];
        vm.refreshStaffNo = function (StaffNo) {

            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getStaffNoList", StaffNo: StaffNo }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {

                ////console.log(response);
                var result = response;
                if (StaffNo)
                    result.unshift(StaffNo);
                vm.staffNoArray = result;

                if ($scope.userForm)
                    $scope.userForm.$setPristine();
            });


        };


    })();

    $scope.resetPassword = function () {

        if ($scope.userForm.$invalid) return;

        ////console.log($scope.sampleObj);

        if ($scope.sampleObj.ConfirmPassword != $scope.sampleObj.NewPassword) {
            toastr.error("新密码与确认密码不一致", "失敗");
            return;
        }


        //$.ajax({
        //    url: host + "/HttpHandler/AjaxHandler.ashx",
        //    type: 'POST',
        //    data: {
        //        action: "resetPassword",
        //        Password: $scope.sampleObj.Password,
        //        NewPassword: $scope.sampleObj.NewPassword,
        //    },
        //    dataType: "json",
        //    error: function (xhr) {
        //        ////console.log("failed");
        //    },
        //    success: function (response) {

        //        if (response.result == "1") {
        //            toastr.success(response.message, "成功");
        //            window.location = "/#!/login";
        //        }
        //        else {
        //            toastr.error(response.message, "失敗");
        //        }

        //    }
        //});

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "resetPassword",
                Password: $scope.sampleObj.Password,
                NewPassword: $scope.sampleObj.NewPassword,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            if (response.result == "1") {
                toastr.success(response.message, "成功");
                window.location = "/#!/login";
            }
            else {
                toastr.error(response.message, "失敗");
            }
        });

    };

}

export function ClientMasterCtrl($scope, $rootScope, $http, $location, $window, $stateParams, toastr) {

    console.log("ClientMasterCtrl");

    var vm = this;
    function NewClientMaster() {
        return {
            ClientShareholderList: [],
            ResponsibleStaffList: [],
            CurrencyList: []
        };
    };

    $scope.role = 0;
    //object initialization
    (function () {
        $scope.clientMasterObj = NewClientMaster();

        $scope.generalMaster('MemberType');
        $scope.generalMaster('Staff');
        $scope.generalMaster('staffType');
        $scope.generalMaster('Currency');
        $scope.generalMaster('JudgeTitle');
    })();

    $scope.clientIDChange = function () {


        // $location.path('/index/Client/' + [
        //     $scope.clientMasterObj.ClientID
        // ].join('&'), false);

        $scope.getClient();
    }

    $scope.getClient = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getClientInfo", ClientID: $scope.clientMasterObj.ClientID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response.ClientMasterInfo) {
                $scope.clientMasterObj = response.ClientMasterInfo; 
            }
            else {
                var clientID = $scope.clientMasterObj.ClientID
                $scope.clientMasterObj = NewClientMaster();
                $scope.clientMasterObj.ClientID = clientID;
            }

            $rootScope.loginInfo.currentClientID = $scope.clientMasterObj.ClientID;

            $scope.role = response.Role;
            $scope.ClientShareholderListMaxNo = response.ClientShareholderListMaxNo;
            $scope.islawyer = response.ResponsibilityType == 3;
            $scope.ResponsibilityType = response.ResponsibilityType;
 
            //
            console.log($scope.clientMasterObj.ResponsibleStaffList);
            $.each($scope.clientMasterObj.ResponsibleStaffList, function(index, value){
                if($scope.role == 3){
                    value.mode = 'edit';
                }
                else if(response.ResponsibilityType == 1 && $scope.role != 3) {
                    if (value.ResponsibilityType == "1") {
                        value.mode = 'read';
                    } else {
                        value.mode = 'edit';
                    }
                }                         
                else 
                    value.mode = 'read';
            });
            console.log($scope.clientMasterObj.ResponsibleStaffList);

            $scope.refresh_ui_select('ClientMaster', $scope.clientMasterObj.ClientID);
        });
    }

    $scope.saveClient = function () {


        if ($scope.clientMasterForm.$invalid) return;


        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "saveClient",
                ClientInfo: JSON.stringify($scope.clientMasterObj)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            toastr.success(response.message, "成功");
            ////console.log("success");

            if (!$rootScope.loginInfo.currentClientID) {
                $scope.clientMasterObj.ClientID = response.ClientID;
                $rootScope.loginInfo.currentClientID = response.ClientID;
                $scope.refresh_ui_select('ClientMaster', $scope.clientMasterObj.ClientID);
                //$window.location.reload();
            }
            //refreshHandle($stateParams, $rootScope);

        });


    }

    $scope.deleteClient = function () {
        var confirmed = confirm("确认删除记录?");
        if (confirmed) {

            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "deleteClient", ClientID: $scope.clientMasterObj.ClientID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {

                response = response.data;
                alert(response.message);
                ////console.log("success");
                $scope.clientMasterObj = NewClientMaster();
                ////console.log($scope.clientMasterObj);

                if ($scope.clientMasterForm)
                    $scope.clientMasterForm.$setPristine();
            });
        }
    }

    $scope.staffIDChange = function (StaffID) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getStaffName", ClientID: $scope.clientMasterObj.ClientID, StaffID: StaffID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response) {
                for (var i = 0; i < $scope.clientMasterObj.ResponsibleStaffList.length; i++) {
                    if ($scope.clientMasterObj.ResponsibleStaffList[i].StaffID == StaffID) {
                        $scope.clientMasterObj.ResponsibleStaffList[i].StaffName = response;
                    }
                }
            }
        })
    }

    $scope.currencyCodeChange = function (CurrencyCode) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getCurrency", CurrencyCode: CurrencyCode }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response) {
                for (var i = 0; i < $scope.clientMasterObj.CurrencyList.length; i++) {
                    if ($scope.clientMasterObj.CurrencyList[i].CurrencyCode == CurrencyCode) {
                        $scope.clientMasterObj.CurrencyList[i].Currency = response.Currency;
                        $scope.clientMasterObj.CurrencyList[i].Rate = response.Rate;
                    }
                }
            }
        })

    }
    // Add row
    $scope.addClientShareholder = function () {
        if (!$scope.clientMasterObj.ClientShareholderList)
            $scope.clientMasterObj.ClientShareholderList = [];

        var rowNo = $scope.clientMasterObj.ClientShareholderList.length + 1;
        $scope.clientMasterObj.ClientShareholderList.push({
            RowNo: rowNo
        });

        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }
    $scope.addClientCourtJudge = function () {
        if (!$scope.clientMasterObj.ClientCourtJudgeList)
            $scope.clientMasterObj.ClientCourtJudgeList = [];

        var rowNo = $scope.clientMasterObj.ClientCourtJudgeList.length + 1;
        $scope.clientMasterObj.ClientCourtJudgeList.push({
            RowNo: rowNo
        });
    }

    $scope.addResponsibleStaff = function () {
        if (!$scope.clientMasterObj.ResponsibleStaffList)
            $scope.clientMasterObj.ResponsibleStaffList = [];
        $scope.clientMasterObj.ResponsibleStaffList.push({
            ClientID: $scope.clientMasterObj.ClientID,
        });

        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }

    $scope.removeClientMember = function ($index) {

        $scope.clientMasterObj.ClientMemberList.splice($index, 1);

    }
    $scope.removeClientCourtJudge = function ($index) {

        $scope.clientMasterObj.ClientCourtJudgeList.splice($index, 1);

    }

    $scope.addCurrency = function () {
        if (!$scope.clientMasterObj.CurrencyList)
            $scope.clientMasterObj.CurrencyList = [];
        $scope.clientMasterObj.CurrencyList.push({
            ClientID: $scope.clientMasterObj.ClientID,
        });
        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }

    $scope.addClientMember = function () {

        if (!$scope.clientMasterObj.ClientMemberList) {
            $scope.clientMasterObj.ClientMemberList = [];
        }
        var rowNo = $scope.clientMasterObj.ClientMemberList.length + 1;
        $scope.clientMasterObj.ClientMemberList.push({
            RowNo: rowNo
        });

    }
    // Remove row
    $scope.removeClientShareholder = function ($index) {
        $scope.clientMasterObj.ClientShareholderList.splice($index, 1);
        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }

    $scope.removeResponsibleStaff = function ($index) {
        $scope.clientMasterObj.ResponsibleStaffList.splice($index, 1);
        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }

    $scope.removeCurrency = function ($index) {
        $scope.clientMasterObj.CurrencyList.splice($index, 1);
        if ($scope.clientMasterForm)
            $scope.clientMasterForm.$setPristine();
    }


    if ($rootScope.loginInfo.currentClientID) {
        $scope.clientMasterObj.ClientID = $rootScope.loginInfo.currentClientID;
        $scope.getClient();
    }
}

export function EmployeeCtrl($scope, $http, $timeout, $stateParams, $rootScope, toastr, DTColumnBuilder, $compile, $filter) {

    var vm = this;
    //object initialization
    (function () {
        $scope.clientIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEmployeeInfo", ClientID: $scope.employeeObj.ClientID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                if (response) {
                    $scope.EmployeeList = response.EmployeeList;
                    $scope.islawyer = response.ResponsibilityType == 3;

                    $scope.dtInstance.DataTable.clear();
                    $scope.dtInstance.DataTable.rows.add($scope.EmployeeList).draw();
                }

            });
        }

        $scope.employeeObj = {
        };

        $scope.mode = '';

        $scope.EmployeeList = [];


        // vm.refreshEmployeeID = function (clientStaffID) {
        //     // if (!$scope.employeeForm.ClientID) return;
        //     $http({
        //         method: 'POST', withCredentials: true,
        //         url: host + '/HttpHandler/AjaxHandler.ashx',
        //         data: $.param({ action: "GetClientStaffIDList", ClientID: $scope.employeeObj.ClientID, ClientStaffID: clientStaffID }),
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //     }).then(function (response) {
        //         response = response.data;
        //         var result = response;
        //         if (clientStaffID)
        //             result.unshift(clientStaffID);
        //         vm.clientStaffIDs = result;
        //         if ($scope.employeeForm)
        //             $scope.employeeForm.$setPristine();
        //     });
        // }


        if ($rootScope.loginInfo.currentClientID) {
            $scope.employeeObj.ClientID = $rootScope.loginInfo.currentClientID;
            $scope.clientIDChange();
        }


    })();
    $scope.addEmployee = function () {
        $scope.mode = "C";
        var ClientID = $scope.employeeObj.ClientID;
        $scope.employeeObj = {};
        $scope.employeeObj.ClientID = ClientID;

        if ($scope.employeeForm)
            $scope.employeeForm.$setPristine();
    }

    $scope.clientStaffIDChange = function () {
        var isExist = false;
        $.each($scope.EmployeeList, function (index, value) {
            if (value.ClientStaffID == $scope.employeeObj.ClientStaffID) {
                isExist = true;
                angular.extend($scope.employeeObj, value);
                return false;
            }
        })
        if (!isExist) {
            $scope.employeeObj = {
                ClientID: $scope.employeeObj.ClientID,
                ClientStaffID: $scope.employeeObj.ClientStaffID,
            };

        }
    }

    $scope.editEmployee = function (employeeObj) {
        angular.extend($scope.employeeObj, employeeObj);

        $scope.refresh_ui_select('EmployeeMaster', $scope.employeeObj.ClientStaffID, 0, 1);

        $scope.mode = "E";
        $timeout(function () {
            $("#FocusControl").focus();
        });
    }

    $scope.saveEmployee = function () {
        if ($scope.employeeForm.$invalid) return;

        delete $scope.employeeObj.CreateDate;
        delete $scope.employeeObj.LastModifiedDate;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "saveEmployee",
                EmployeeInfo: JSON.stringify($scope.employeeObj)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
            ////console.log("success");

            $scope.clientIDChange();
            $scope.mode = "";

        });

    }

    $scope.removeEmployee = function (employeeID) {


        $http({
            type: 'POST',
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({
                action: "deleteEmployee", ClientID: $scope.employeeObj.ClientID, ClientStaffID: employeeID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
            $scope.clientIDChange();

        });
        // $.ajax({
        //     type: 'POST',
        //     url: host + "/HttpHandler/AjaxHandler.ashx",
        //     data: { action: "deleteEmployee", ClientID: $scope.employeeObj.ClientID, ClientStaffID: employeeID },
        //     dataType: "json",
        //     error: function (xhr) {
        //         ////console.log("failed");
        //     },
        //     success: function (response) {
        //         toastr.success(response.message, "成功");
        //         $scope.clientIDChange();

        //     }
        // })
    }

    $scope.updateAvgWage = function () {
        $scope.employeeObj.AvgWage = parseFloat(((parseFloat($scope.employeeObj.MonthlyWage) * 12 + parseFloat($scope.employeeObj.AnnualBonus)) / 12).toFixed(2));
    }

    $scope.updateTotal = function () {
        $scope.employeeObj.Total = parseFloat($scope.employeeObj.NoReleaseWage) + parseFloat($scope.employeeObj.NoReleaseBonus) + parseFloat($scope.employeeObj.NoReimbursementAmt);
    }

    $scope.log = function () {
        ////console.log("EmployeeObj", $scope.employeeObj);
    }

    //data table 
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    };
    (function () {

        function actionsHtml(data, type, full, meta) {
            return '<a class="fa fa-trash-o" style="font-size: 15px;color: red; margin-left:10px;margin-right:10px;" ng-click="removeEmployee(\'' + data.ClientStaffID + '\')"></a>';
        };
        function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td', nRow).unbind('dblclick');
            $('td', nRow).bind('dblclick', function () {
                $scope.$apply(function () {
                    $scope.editEmployee(aData);
                });
            });
            return nRow;
        };
        $scope.dtOptions.withOption('rowCallback', rowCallback).withOption('createdRow', createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('ClientStaffID').withTitle('员工编号'),
            DTColumnBuilder.newColumn('ClientStaffName').withTitle('员工姓名'),
            DTColumnBuilder.newColumn('MonthlyWage').withTitle('每月工资').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('AnnualBonus').withTitle('每年奖金').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('AvgWage').withTitle('平均工资').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('NoReleaseWage').withTitle('未发工资汇总').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('NoReleaseBonus').withTitle('未发奖金').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('NoReimbursementAmt').withTitle('未报销金额').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('Total').withTitle('合计').withClass("table-right-align").renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn(null).withTitle('').notSortable()
                .renderWith(actionsHtml)
        ];
        $scope.dtInstance = {};

    })();

}

export function CreditorInquiryCtrl($scope, $http, $state, DTColumnBuilder, $stateParams, $rootScope, $compile) {

    //refreshHandle($stateParams, $rootScope);

    var vm = this;

    function NewCreditorInquiryObj() {
        return {
        };
    }

    (function () {
        $scope.CreditorInquiryObj = NewCreditorInquiryObj();

        if ($rootScope.loginInfo.currentClientID) {
            $scope.CreditorInquiryObj.ClientID = $rootScope.loginInfo.currentClientID;
        }
        else {
            $state.go('login');
            return;
        }

        $scope.getClientResponsibilityType($state, $rootScope, $http);


        vm.refreshCreditorID = function (creditorid) {
            if (!$scope.CreditorInquiryObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getCreditorIDList", ClientID: $scope.CreditorInquiryObj.ClientID, CreditorID: creditorid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                if (creditorid)
                    result.unshift(creditorid);
                vm.creditorids = result;
            });
        }

        $scope.clientIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientInfo", ClientID: $scope.CreditorInquiryObj.ClientID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.ResponsiblePersonList = result.ClientMasterInfo.ResponsibleStaffList;

                $scope.ResponsiblePersonList.unshift({ StaffID: '', StaffName: 'ALL' });
            });
        }

        $scope.clientIDChange();

        //$scope.getGeneralMasterList(["CompanyType", "CreditorType", "Status"]);

    })();

    //data table
    (function () {

        var createdRow = function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };

        function actionsHtml(data, type, full, meta) {
            return '<a class="fa fa-trash-o" style="font-size: 15px;color: red; margin-left:10px;margin-right:10px;" ng-click="removeCrediitor(\'' + data.ClientID + '\',\'' + data.CreditorID + '\')"></a>';
        };

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
            DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
            // DTColumnBuilder.newColumn('CreditorType').withTitle('债权类别'),
            DTColumnBuilder.newColumn('Status').withTitle('状况'),
            DTColumnBuilder.newColumn('MainCreditor').withTitle('是否主债权人'),
            DTColumnBuilder.newColumn(null).withTitle('').notSortable()
                .renderWith(actionsHtml)
        ];
        $scope.dtInstance = {};

        function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('dblclick');
            $('td', nRow).bind('dblclick', function () {
                $scope.$apply(function () {
                    $state.go('index.Creditor.Creditors', { ID: $scope.CreditorInquiryObj.ClientID, CreditorID: aData.CreditorID });
                });
            });
            return nRow;
        }
        $scope.dt_simple_Options.withOption('rowCallback', rowCallback).withOption('createdRow', createdRow);


    })();

    $scope.search = function () {

        var criteria = {};
        angular.copy($scope.CreditorInquiryObj, criteria);
        if (criteria.CreditorID == "ALL") criteria.CreditorID = "";

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "searchCreditor",
                ClientID: criteria.ClientID,
                Criteria: JSON.stringify(criteria),
                FieldsDataType: JSON.stringify({
                    CreditorID: 'string',
                    CreditorName: 'string',
                    CreditorIDNo: 'string',
                    CreditorType: 'string',
                    Status: 'string',
                    CompanyType: 'string',
                    ReportDate_From: 'datetime',
                    ReportDate_To: 'datetime',
                    ResponsiblePerson: 'string',
                }),
                FieldsOperator: JSON.stringify({
                    CreditorID: '=',
                    CreditorName: 'like',
                    CreditorIDNo: 'like',
                    CreditorType: 'like',
                    Status: 'like',
                    CompanyType: 'like',
                    ReportDate_From: '>=',
                    ReportDate_To: '<=',
                    ResponsiblePerson: 'like',
                }),
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                if (response.message)
                    alert(response.message);

                var result = response.ClientList;

                $scope.dtInstance.DataTable.clear();
                $scope.dtInstance.DataTable.rows.add(result).draw();
            }
        });

    }
    $scope.reset = function () {

        $scope.CreditorInquiryObj = NewCreditorInquiryObj();
        $scope.CreditorInquiryObj.ClientID = $rootScope.loginInfo.currentClientID;

    }
    $scope.removeCrediitor = function (ClientID, CreditorID) {
        var confirmed = confirm("确认删除记录?");
        if (confirmed) {

            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({
                    action: "deleteCreditor",
                    ClientID: $scope.loginInfo.currentClientID,
                    CreditorID: CreditorID
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {

                response = response.data;
                alert(response.message);
                $scope.search();

            });
        }

    }


}

export function CreditorCtrl($scope, $http, $location, $stateParams, $rootScope, toastr, DTColumnBuilder, DTColumnDefBuilder, $filter, $timeout, $state) {
    var vm = this;

    function NewCreditorObj() {
        return {
            CreditorAuditDetailList: [],
            ExamineRecordList: [],
            CreditorAttachmentList: [],
            ChangeRecordList: []
        };
    }

    (function () {
        //refreshHandle($stateParams, $rootScope);

        vm.clientid = [];
        vm.creditorid = [];
        vm.currencyCode = [];
        vm.refreshCurrencyCode = function (currencycode) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getCurrencyCodeListByClient", CurrencyCode: currencycode, ClientID: $scope.creditorObj.ClientID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.currencyCodeList = result;
                if ($scope.creditorMasterForm)
                    $scope.creditorMasterForm.$setPristine();
            });
        };
        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.clientid = result;
                if ($scope.creditorMasterForm)
                    $scope.creditorMasterForm.$setPristine();
            });
        };
        vm.refreshCreditorID = function (creditorid) {
            if (!$scope.creditorObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getCreditorIDList", ClientID: $scope.creditorObj.ClientID, CreditorID: creditorid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                if (creditorid)
                    result.unshift(creditorid);
                vm.creditorids = result;
                if ($scope.creditorMasterForm)
                    $scope.creditorMasterForm.$setPristine();
            });
        }
        $scope.generalMaster('AttType');
        $scope.generalMaster('ExamineType');
        $scope.generalMaster('CreditType');
        //$scope.getGeneralMasterList(["CreditType", "CreditorType", "Status", "staffType", "YesNo", "CreditorRelation"]);
    })();

    // Record Key
    $scope.creditorIDChange = function () {

        //if (!$scope.creditorObj.ClientID || !$scope.creditorObj.CreditorID) return;
        //$state.go('index.Creditors', { ID: $scope.creditorObj.ClientID, CreditorID: $scope.creditorObj.CreditorID });

        $location.path('/index/Creditor/Creditors/' + [
            $scope.creditorObj.ClientID,
            $scope.creditorObj.CreditorID,
        ].join('&')).replace();

        $scope.viewCreditor();
    }

    $scope.currencyCodeChange = function (CurrencyCode) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getClientCurrency", ClientID: $scope.creditorObj.ClientID, CurrencyCode: CurrencyCode }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response) {
                $scope.creditorObj.Rate = response.Rate;
            }
        })

    }

    $scope.securedCurrencyCodeChange = function (CurrencyCode) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getClientCurrency", ClientID: $scope.creditorObj.ClientID, CurrencyCode: CurrencyCode }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {

            response = response.data;
            ////console.log(response);
            if (response) {
                $scope.creditorObj.SecuredRate = response.Rate;
            }
        })

        // $http({
        //     method: 'POST', withCredentials: true,
        //     url: host + '/HttpHandler/AjaxHandler.ashx',
        //     data: $.param({ action: "getCurrency", CurrencyCode: CurrencyCode }),
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        // }).then(function (response) {
        //     response = response.data; 
        //     if (response) {
        //         $scope.creditorObj.SecuredRate = response.Rate;
        //     }
        // })

    }

    $scope.createCreditor = function () {
        $scope.mode = 'C';
        var clientID = $scope.creditorObj.ClientID;
        $scope.creditorObj = NewCreditorObj();
        $scope.creditorObj.ClientID = clientID;

    }

    $scope.viewCreditor = function () {

        console.log($state);
        console.log('viewCreditor');
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getCreditorInfo", ClientID: $scope.creditorObj.ClientID, CreditorID: $scope.creditorObj.CreditorID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            var result = response;

            console.log(response);

            $scope.total = {};

            $scope.ResponsiblePersonList = result.ResponsiblePersonList;
            $scope.UserRole = result.Role;

            //access control 
            $scope.islawyer = $scope.UserRole == 3;
            $scope.isIncharge = false;
            for (var i = 0, item; item = result.ResponsiblePersonList[i]; i++) {
                if (item.StaffID == result.LoginID && item.ResponsibilityType == 1) {
                    $scope.isIncharge = true;
                    break;
                }
            }

            if (!response.CreditorInfo && $scope.creditorObj.CreditorID) {
                console.log($state);
                //$state.go('index.Creditor.CreditorInquiry', { ID: $scope.creditorObj.ClientID });
                
                $location.path(`/index/Creditor/CreditorInquiry/${$scope.creditorObj.ClientID}`).replace();
                return;
            }

            if (response.CreditorInfo) {
                $scope.creditorObj = response.CreditorInfo;


                $scope.dtInstance.DataTable.clear();
                $scope.dtInstance.DataTable.rows.add($scope.creditorObj.ChangeRecordList).draw();


                $scope.examineRecordMaxRowNo = response.ExamineRecordMaxRowNo;
                $scope.creditorAttachmentMaxRowNo = response.CreditorAttachmentMaxRowNo;
            }
            else {
                var ClientID = $scope.creditorObj.ClientID;
                var CreditorID = $scope.creditorObj.CreditorID;
                $scope.creditorObj = NewCreditorObj();
                $scope.total = {};
                $scope.creditorObj.ClientID = ClientID;
                $scope.creditorObj.CreditorID = CreditorID;


                // var creditTypeArray = $scope.generalMater('CreditType');
                // //console.log(creditTypeArray);
                // for (var i in creditTypeArray) {
                //     $scope.creditorObj.CreditorAuditDetailList.push({
                //         CreditorType: creditTypeArray[i].Desc,
                //         RowNo: parseInt(i)
                //     });
                // }

                $scope.examineRecordMaxRowNo = 0;
                $scope.creditorAttachmentMaxRowNo = 0;
            }

            $scope.calcTtl();


        });

    }

    $scope.getResponsiblePersonList = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getResponsiblePersonList", ClientID: $scope.creditorObj.ClientID, }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            console.log(response);
            response = response.data;

            if (response) {
                $scope.ResponsiblePersonList = response.ResponsiblePersonList;
            }
        })
    }

    // Examine Record
    $scope.addExamineRecord = function () {
        if (!$scope.creditorObj.ExamineRecordList)
            $scope.creditorObj.ExamineRecordList = [];
        $scope.creditorObj.ExamineRecordList.push({
            RowNo: ++$scope.examineRecordMaxRowNo
        });

        if ($scope.creditorMasterForm)
            $scope.creditorMasterForm.$setPristine();
    }

    $scope.removeExamineRecord = function (i) {
        $scope.creditorObj.ExamineRecordList.splice(i, 1);
    }

    // Attachment List
    $scope.addAttachment = function () {
        if (!$scope.creditorObj.CreditorAttachmentList)
            $scope.creditorObj.CreditorAttachmentList = [];
        $scope.creditorObj.CreditorAttachmentList.push({
            RowNo: ++$scope.creditorAttachmentMaxRowNo
        });
        if ($scope.creditorMasterForm)
            $scope.creditorMasterForm.$setPristine();
    }

    $scope.removeAttachment = function (i) {
        $scope.creditorObj.CreditorAttachmentList.splice(i, 1);
    }

    $scope.downloadAttachment = function (attachmentID) {
        ////console.log(attachmentID);
    }

    //creditor amount
    $scope.addCreditorAmount = function () {
        if (!$scope.creditorObj.CreditorAmountList)
            $scope.creditorObj.CreditorAmountList = [];

        var rowNo = $scope.creditorObj.CreditorAmountList.length + 1;
        $scope.creditorObj.CreditorAmountList.push({
            RowNo: rowNo,
        });

        if ($scope.creditorMasterForm)
            $scope.creditorMasterForm.$setPristine();

    }
    $scope.removeCreditorAmount = function ($index) {
        $scope.creditorObj.CreditorAmountList.splice($index, 1);
    }

    // System
    $scope.saveCreditor = function () {

        if (!confirm("确定储存?")) return;

        ////console.log($scope.creditorObj);

        if ($scope.creditorMasterForm.$invalid) return;


        //delete $scope.creditorObj.CreateDate;
        //delete $scope.creditorObj.LastModifiedDate; 
        delete $scope.creditorObj.ChangeRecordList;

        //for (var i = 0; i < $scope.creditorObj.ExamineRecordList.length; i++) {
        //    delete $scope.creditorObj.ExamineRecordList[i].ExamineDate;
        //}

        for (var i = 0; i < $scope.creditorObj.CreditorAuditDetailList.length; i++) {
            var obj = $scope.creditorObj.CreditorAuditDetailList[i];
            $scope.creditorObj.CreditorAuditDetailList[i].MatchOpinion =
                (obj.AdminExamineNotConfirm == obj.LawyerExamineNotConfirm
                    && obj.AdminExamineWaitConfirm == obj.LawyerExamineWaitConfirm
                    && obj.AdminExamineConfirm == obj.LawyerExamineConfirm) ? "Y" : "N";
        }

        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "saveCreditor", CreditorInfo: JSON.stringify($scope.creditorObj) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");

            $scope.creditorObj.ChangeRecordList = response.ChangeRecordList;
            $scope.creditorObj.ExamineRecordList = response.ExamineRecordList;


            $scope.dtInstance.DataTable.clear();
            $scope.dtInstance.DataTable.rows.add($scope.creditorObj.ChangeRecordList).draw();
        });
    }

    $scope.calcTtl = function () {
        $scope.total = {};
        for (var pro in $scope.creditorObj.CreditorAmountList) {
            var currency = $scope.creditorObj.CreditorAmountList[pro]["Currency"];
            $scope.total[currency] = [];

            $scope.total[currency].Currency = currency;
        }

        for (var pro in $scope.total) {
            $scope.total[pro].TtlBookAmt = 0;
            $scope.total[pro].TtlDeclareAmt = 0;
            $scope.total[pro].TtlAdminExamineNotConfirm = 0;
            $scope.total[pro].TtlAdminExamineWaitConfirm = 0;
            $scope.total[pro].TtlAdminExamineConfirm = 0;
            $scope.total[pro].TtlLawyerExamineNotConfirm = 0;
            $scope.total[pro].TtlLawyerExamineWaitConfirm = 0;
            $scope.total[pro].TtlLawyerExamineConfirm = 0;

        }

        for (var i = 0; i < $scope.creditorObj.CreditorAuditDetailList.length; i++) {
            var BookAmt = $scope.creditorObj.CreditorAuditDetailList[i].BookAmt ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].BookAmt) : 0;
            var DeclareAmt = $scope.creditorObj.CreditorAuditDetailList[i].DeclareAmt ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].DeclareAmt) : 0;
            var AdminExamineNotConfirm = $scope.creditorObj.CreditorAuditDetailList[i].AdminExamineNotConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].AdminExamineNotConfirm) : 0;
            var AdminExamineWaitConfirm = $scope.creditorObj.CreditorAuditDetailList[i].AdminExamineWaitConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].AdminExamineWaitConfirm) : 0;
            var AdminExamineConfirm = $scope.creditorObj.CreditorAuditDetailList[i].AdminExamineConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].AdminExamineConfirm) : 0;
            var LawyerExamineNotConfirm = $scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineNotConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineNotConfirm) : 0;
            var LawyerExamineWaitConfirm = $scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineWaitConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineWaitConfirm) : 0;
            var LawyerExamineConfirm = $scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineConfirm ? parseFloat($scope.creditorObj.CreditorAuditDetailList[i].LawyerExamineConfirm) : 0;

            var currency = $scope.creditorObj.CreditorAuditDetailList[i].Currency;

            $scope.total[currency].TtlBookAmt += BookAmt;
            $scope.total[currency].TtlDeclareAmt += DeclareAmt;
            $scope.total[currency].TtlAdminExamineNotConfirm += AdminExamineNotConfirm;
            $scope.total[currency].TtlAdminExamineWaitConfirm += AdminExamineWaitConfirm;
            $scope.total[currency].TtlAdminExamineConfirm += AdminExamineConfirm;
            $scope.total[currency].TtlLawyerExamineNotConfirm += LawyerExamineNotConfirm;
            $scope.total[currency].TtlLawyerExamineWaitConfirm += LawyerExamineWaitConfirm;
            $scope.total[currency].TtlLawyerExamineConfirm += LawyerExamineConfirm;
        }
    }

    // Maintenance
    $scope.log = function () {
        ////console.log($scope.creditorObj);
    }

    //projection data table
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('StaffID').withTitle('用户'),
        DTColumnBuilder.newColumn('CreditTypeDesc').withTitle('债权类別'),
        DTColumnBuilder.newColumn('Area').withTitle('字段'),
        DTColumnBuilder.newColumn('Currency').withTitle('币种'),
        DTColumnBuilder.newColumn('ValueFrom').withTitle('数值（由）').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('ValueTo').withTitle('数值（至）').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('UpdateDate').withTitle('更改日期'),

    ];
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef([5]).withOption('type', 'date')
    ];
    $scope.dtInstance = {};

    //init creditor obj
    $scope.creditorObj = NewCreditorObj();
    if ($rootScope.loginInfo.currentClientID) {
        $scope.creditorObj.ClientID = $rootScope.loginInfo.currentClientID;
        $scope.getResponsiblePersonList();
    }

    if ($stateParams.CreditorID) {
        $scope.creditorObj.CreditorID = $stateParams.CreditorID;
        $scope.viewCreditor();
    }

    $scope.generateAuditAmountList = function () {

        console.log('$scope.creditorObj.CreditorAuditDetailList');

        var creditTypeArray = $scope.generalMaster('CreditType');
        if (!creditTypeArray.length) {
            console.log('timeout $scope.creditorObj.CreditorAuditDetailList');
            $timeout($scope.generateAuditAmountList(), 500);
            return;
        }

        var tmpArray = [];

        //console.log(creditTypeArray);

        var rowNo = 0;
        for (var i in creditTypeArray) {
            for (var pro in $scope.creditorObj.CreditorAmountList) {

                var currency = $scope.creditorObj.CreditorAmountList[pro]["Currency"];
                //var amount = $scope.creditorObj.CreditorAmountList[pro]["Amount"];

                //get the existing amount when  re-generate the list
                var existingAuditAmountObj = {};
                for (var auditIndex in $scope.creditorObj.CreditorAuditDetailList) {
                    var obj = $scope.creditorObj.CreditorAuditDetailList[auditIndex];
                    if (obj.CreditTypeDesc === creditTypeArray[i].Desc && obj.Currency === currency) {
                        existingAuditAmountObj = obj;
                    }
                }


                tmpArray.push({
                    //DeclareAmt: (creditTypeArray[i].Code == "4" ? amount : 0),
                    DeclareAmt: 0,
                    CreditorType: creditTypeArray[i].Code,
                    CreditTypeDesc: creditTypeArray[i].Desc,
                    Currency: currency,
                    ...existingAuditAmountObj,
                    RowNo: ++rowNo,
                });

            }
        }
        // console.log(tmpArray);
        $scope.creditorObj.CreditorAuditDetailList = tmpArray;
        $scope.calcTtl();
    }

    $scope.refresh = function () {

        if (!confirm("确定产生债权人审查意见?")) return;

        $scope.generateAuditAmountList();
    }

}

export function CreditorImportCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope, toastr) {
    var vm = this;

    (function () {

        //refreshHandle($stateParams, $rootScope);
        $scope.creditorFile = {};
        vm.clientid = [];
        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;


                ////console.log(response);
                var result = response;
                vm.clientid = result;
                //$scope.creditorMasterForm.$setPristine();
            });
        };

    })();

    //refreshHandle($stateParams, $rootScope);
    $scope.creditorFile.ClientID = $stateParams.ID;

    // System
    $scope.ButtonDisplay = "导入";
    $scope.ButtonClass = "fa-check";
    $scope.ButtonDisabled = false;
    $scope.import = function () {

        //////console.log($scope.creditorFile); return;
        $scope.ButtonDisplay = "导入中...";
        $scope.ButtonClass = "fa-refresh fa-spin";
        $scope.ButtonDisabled = true;
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "importCreditor", CreditorInfo: JSON.stringify($scope.creditorFile) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
            $scope.ButtonDisplay = "导入";

            console.log(response);
            window.location = host + "/HttpHandler/ReportHandler.ashx?action=downloadLogReport&FileName=" + response.fileName + "&ClientID=" + $scope.creditorFile.ClientID;


            $scope.ButtonClass = "fa-check";
            $scope.ButtonDisabled = false;
        });
    }
    $scope.importEmployee = function () {

        //////console.log($scope.creditorFile); return;
        $scope.ButtonDisplay = "导入中...";
        $scope.ButtonClass = "fa-refresh fa-spin";
        $scope.ButtonDisabled = true;
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "importEmployee", EmployeeInfo: JSON.stringify($scope.creditorFile) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");

            $scope.ButtonDisplay = "导入";
            $scope.ButtonClass = "fa-check";
            $scope.ButtonDisabled = false;
        });
    }



}

export function CreditorContactImportCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope, toastr) {
    var vm = this;

    (function () {

        //refreshHandle($stateParams, $rootScope);
        $scope.creditorFile = {};
        vm.clientid = [];
        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;


                ////console.log(response);
                var result = response;
                vm.clientid = result;
                //$scope.creditorMasterForm.$setPristine();
            });
        };

    })();

    //refreshHandle($stateParams, $rootScope);
    $scope.creditorFile.ClientID = $stateParams.ID;

    // System
    $scope.ButtonDisplay = "导入";
    $scope.ButtonClass = "fa-check";
    $scope.ButtonDisabled = false;
    $scope.import = function () {

        //////console.log($scope.creditorFile); return;
        $scope.ButtonDisplay = "导入中...";
        $scope.ButtonClass = "fa-refresh fa-spin";
        $scope.ButtonDisabled = true;
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "importCreditorContact", CreditorInfo: JSON.stringify($scope.creditorFile) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
            $scope.ButtonDisplay = "导入";

            console.log(response);
            //window.location = host + "/HttpHandler/ReportHandler.ashx?action=downloadLogReport&FileName=" + response.fileName + "&ClientID=" + $scope.creditorFile.ClientID;


            $scope.ButtonClass = "fa-check";
            $scope.ButtonDisabled = false;
        });
    }
    $scope.importEmployee = function () {

        //////console.log($scope.creditorFile); return;
        $scope.ButtonDisplay = "导入中...";
        $scope.ButtonClass = "fa-refresh fa-spin";
        $scope.ButtonDisabled = true;
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "importEmployee", EmployeeInfo: JSON.stringify($scope.creditorFile) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");

            $scope.ButtonDisplay = "导入";
            $scope.ButtonClass = "fa-check";
            $scope.ButtonDisabled = false;
        });
    }



}

//Voting
export function VotingEventSetupCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope, toastr, DTOptionsBuilder) {
    var vm = this;
    function NewVotingEventSetupObj() {
        var clientID = ""; var EventID = "";
        if ($scope.votingEventSetupObj)
            clientID = $scope.votingEventSetupObj.ClientID;

        if ($rootScope.loginInfo.currentEventID) {
            EventID = $rootScope.loginInfo.currentEventID;
        }

        return {
            ClientID: clientID,
            EventID: EventID
            // VotingQuestionList: [],
            // VotingResultList: [],
            // VotingReplyList: [],
            // AttendanceList: [],
            // VotingResultDetailList: []
        };
    }

    console.log("clientIDChange");
    (function () {

        $scope.clientIDChange = function () {
            console.log("clientIDChange");
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventDetailsList", ClientID: $scope.votingEventSetupObj.ClientID, EventID: $scope.votingEventSetupObj.EventID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;

                ////console.log("$scope.clientIDChange");

                var result = response;
                $scope.votingEventSetupObj = NewVotingEventSetupObj();
                vm.eventids = result.EventIDList;
                $scope.votingEventSetupObj = { ...$scope.votingEventSetupObj, ...result.VotingEventSetupMaster };

                $rootScope.loginInfo.currentEventID = $scope.votingEventSetupObj.EventID;

                $scope.votingEventSetupObj.CreditType = ($scope.votingEventSetupObj.CreditType || "1");

                if ($scope.votingEventSetupForm)
                    $scope.votingEventSetupForm.$setPristine();


                $scope.islawyer = response.ResponsibilityType == 3;
            });
        }

        $scope.eventIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + "/HttpHandler/AjaxHandler.ashx",
                data: $.param({ action: "getVotingEventSetupInfo", ClientID: $scope.votingEventSetupObj.ClientID, EventID: $scope.votingEventSetupObj.EventID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;

                if (response) {
                    if (response.message) {
                        alert(response.message);
                        return;
                    }

                    var result = response;
                    $scope.votingEventSetupObj = result;
                    $rootScope.loginInfo.currentEventID = $scope.votingEventSetupObj.EventID;

                }
            });
        }

        $scope.generalMaster('answerType');

        $scope.votingEventSetupObj = NewVotingEventSetupObj();
        $scope.QuestionIDCounter = 0;

        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;

                ////console.log(response);
                var result = response;
                vm.clientid = result;
                if ($scope.votingEventSetupForm)
                    $scope.votingEventSetupForm.$setPristine();
            });
        };

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingEventSetupObj.ClientID) return;
            $http({
                method: "POST", withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingEventSetupObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.eventid = result;

                if ($scope.votingEventSetupForm)
                    $scope.votingEventSetupForm.$setPristine();

            });
        };

        if ($rootScope.loginInfo.currentClientID) {
            $scope.votingEventSetupObj.ClientID = $rootScope.loginInfo.currentClientID;
            $scope.clientIDChange();
        }



    })();

    $scope.log = function () {
        ////console.log($scope.votingEventSetupObj);
    }

    $scope.addNewEvent = function () {
        if (!$scope.votingEventSetupObj.ClientID) return;
        $http({
            method: "POST", withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "getLastEventID", ClientID: $scope.votingEventSetupObj.ClientID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response != null) {
                var result = response;
                $scope.votingEventSetupObj = NewVotingEventSetupObj();


                if ($scope.votingEventSetupForm)
                    $scope.votingEventSetupForm.$setPristine();

                $scope.votingEventSetupObj.EventID = ++result;

                //$scope.votingResultDetailList = new NgTableParams({}, { dataset: $scope.votingEventSetupObj.VotingResultDetailList });
                //$scope.votingResultDetailList.reload();

                $($scope.votingEventSetupObj.VotingReplyList).each(function (index, value) {
                    if (value.ReplyDate)
                        value.ReplyDate = value.ReplyDate.substr(0, 10);
                });

                //$scope.votingReplyList = new NgTableParams({}, { dataset: $scope.votingEventSetupObj.VotingReplyList });
                //$scope.votingReplyList.reload();
            }
        });
    }

    $scope.addVotingQuestion = function () {
        if (!$scope.votingEventSetupObj.VotingQuestionList)
            $scope.votingEventSetupObj.VotingQuestionList = [];
        $scope.votingEventSetupObj.VotingQuestionList.push({
        });
    }

    $scope.removeVotingQuestion = function (i) {
        $scope.votingEventSetupObj.VotingQuestionList.splice(i, 1);
    }

    // Voting Event Setup Record

    $scope.saveEvent = function () {
        if ($scope.votingEventSetupForm.$invalid) return;

        //dateFieldValueMask($scope, "save");
        delete $scope.votingEventSetupObj.VotingResultDetailList;
        delete $scope.votingEventSetupObj.VotingReplyList;
        $http({
            method: "POST", withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "saveVotingEventSetup", VotingEventSetupInfo: JSON.stringify($scope.votingEventSetupObj) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response)
                toastr.success(response.message, "成功");
            $scope.votingEventSetupObj = response.info;
        });
    }

    $scope.getVotingResultDetailList = function () {

        $http({
            method: "POST", withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({
                action: "GetVotingResultDetailList",
                ClientID: $scope.votingEventSetupObj.ClientID,
                EventID: $scope.votingEventSetupObj.EventID,
                CreditType: $scope.votingEventSetupObj.CreditType,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            $scope.votingEventSetupObj.VotingResultDetailList = response;
        });

    }

    $scope.generateInvitation = function () {

        window.location = host + '/HttpHandler/ReportHandler.ashx?action=generateVotingForm&ClientID=' +
            $scope.votingEventSetupObj.ClientID
            + "&EventID=" + $scope.votingEventSetupObj.EventID;
    }

}

export function VotingReplyEntryCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope, toastr) {
    var vm = this;

    function NewVotingReplyEntryObj() {
        return {
            CreditorAuditDetailList: []
        };
    }

    function GetVotingReplyEntryInfo() {
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "getVotingReplyEntryInfo", 
            ClientID: $scope.votingReplyEntryObj.ClientID, 
            EventID: $scope.votingReplyEntryObj.EventID, 
            CreditorID: $scope.votingReplyEntryObj.CreditorID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            if (response.VotingReplyEntryInfo) {
                var result = response.VotingReplyEntryInfo;
                $scope.votingReplyEntryObj = result;
                //dateFieldValueMask($scope, "get");
            }
            else {
                var ClientID = $scope.votingReplyEntryObj.ClientID;
                var EventID = $scope.votingReplyEntryObj.EventID;
                var CreditorID = $scope.votingReplyEntryObj.CreditorID;
                $scope.votingReplyEntryObj = NewVotingReplyEntryObj();
                $scope.votingReplyEntryObj.ClientID = ClientID;
                $scope.votingReplyEntryObj.EventID = EventID;
                $scope.votingReplyEntryObj.CreditorID = CreditorID;
            }

            if (response.CreditorAuditDetailList) {
                $scope.votingReplyEntryObj.CreditorAuditDetailList = response.CreditorAuditDetailList;
            }

            if (response.CreditorInfo) {
                if (response.CreditorInfo.CreditorName)
                    $scope.votingReplyEntryObj.CreditorName = response.CreditorInfo.CreditorName;
                if (response.CreditorInfo.ResponsiblePerson)
                    $scope.votingReplyEntryObj.ResponsiblePerson = response.CreditorInfo.ResponsiblePerson;
            }


        })
    }

    (function () {
        $scope.clientIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDAndCreditorIDList", 
                ClientID: $scope.votingReplyEntryObj.ClientID, 
                EventID: $scope.votingReplyEntryObj.EventID, 
                CreditorID: $scope.votingReplyEntryObj.CreditorID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                var clientID = $scope.votingReplyEntryObj.ClientID;
                $scope.votingReplyEntryObj = NewVotingReplyEntryObj();
                $scope.votingReplyEntryObj.ClientID = clientID;
                vm.eventids = result.EventIDList;

                $scope.votingReplyEntryObj.EventID = vm.eventids[vm.eventids.length - 1];

                if ($rootScope.loginInfo.currentEventID) {
                    $scope.votingReplyEntryObj.EventID = $rootScope.loginInfo.currentEventID;
                }

                vm.creditorids = result.CreditorIDList;

                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();

                $scope.islawyer = response.ResponsibilityType == 3;

                GetVotingReplyEntryInfo();
            });
        }

        //refreshHandle($stateParams, $rootScope);

        $scope.votingReplyEntryObj = NewVotingReplyEntryObj();

        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.clientid = result;
                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingReplyEntryObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingReplyEntryObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.eventid = result;

                //init the event ID
                $scope.votingReplyEntryObj.EventID = vm.eventid[vm.eventid.length - 1];
                if ($rootScope.loginInfo.currentEventID) {
                    $scope.votingReplyEntryObj.EventID = $rootScope.loginInfo.currentEventID;
                }
                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        vm.refreshCreditorID = function (creditorid) {
            if (!$scope.votingReplyEntryObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getCreditorIDList", ClientID: $scope.votingReplyEntryObj.ClientID, CreditorID: creditorid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.creditorids = result;

                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        if ($rootScope.loginInfo.currentClientID) {
            $scope.votingReplyEntryObj.ClientID = $rootScope.loginInfo.currentClientID;
            $scope.clientIDChange();
        }

    })();


    $scope.eventIDChange = function () {
        $rootScope.loginInfo.currentEventID = $scope.votingReplyEntryObj.EventID;

       // if (!$scope.votingReplyEntryObj.ClientID || !$scope.votingReplyEntryObj.CreditorID) return;
       if (!$scope.votingReplyEntryObj.ClientID) return;

        GetVotingReplyEntryInfo();
    }

    $scope.creditorIDChange = function () {
        if (!$scope.votingReplyEntryObj.ClientID || !$scope.votingReplyEntryObj.EventID) return;
        GetVotingReplyEntryInfo();
    }

    $scope.saveVotingReplyEntry = function () {
        if ($scope.votingReplyEntryForm.$invalid) return;
        //dateFieldValueMask($scope, "save");
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "saveVotingReplyEntry", VotingReplyEntryInfo: JSON.stringify($scope.votingReplyEntryObj) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
        });
    }


    $scope.getScanedCreditorID = function (barcode) {
        //console.log(barcode);
        var inputs = barcode.split("/");
        if (inputs.length == 3) {
            $scope.votingReplyEntryObj.CreditorID = inputs[2].trim();
            $scope.creditorIDChange();
        }
    }

    var pressed = false;
    var chars = [];

    if (!$scope.keyPressListener)
        $scope.keyPressListener = $scope.$on('keypress', function (e, a, key) {
            $scope.$apply(function () {

                if ($scope.manual) return;
                chars.push(key);
                ////console.log(key + ":" + chars.join("|"));

                if (pressed == false) {
                    pressed = true;

                    var promise = $timeout(function () {

                        if (chars.length > 10) {
                            var barcode = chars.join("");
                            ////console.log("Barcode Scanned: " + barcode);
                            $scope.getScanedCreditorID(barcode);
                        }

                        // Stop the pending timeout
                        $timeout.cancel(promise);
                        chars.length = 0;
                        pressed = false;

                    }, 500);

                }
                // set press to true so we do not reenter the timeout function above
                pressed = true;
            });
        });

    // Unregister
    $scope.$on('$destroy', function () {
        $scope.keyPressListener();
    });

}

export function VotingProjectionCtrl($scope, $http, $stateParams, $rootScope, toastr, DTOptionsBuilder, DTColumnBuilder, $compile, $filter) {
    var vm = this;

    function NewVotingProjectionObj() {
        return {
            VotingProjectionList: []
        };
    }

    (function () {
        $scope.clientIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDAndCompanyName", ClientID: $scope.votingProjectionObj.ClientID, EventID: $scope.votingProjectionObj.EventID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                var clientID = $scope.votingProjectionObj.ClientID;
                $scope.votingProjectionObj = NewVotingProjectionObj();
                $scope.votingProjectionObj.ClientID = clientID;
                vm.eventids = result.EventIDList;
                vm.creditorids = result.CreditorIDList;
                if (result.CompanyName)
                    $scope.votingProjectionObj.CompanyName = result.CompanyName;


                if ($scope.votingProjectionForm)
                    $scope.votingProjectionForm.$setPristine();

                if ($stateParams.EventID) {
                    $scope.votingProjectionObj.EventID = $stateParams.EventID;
                    //$scope.eventIDChange();
                }
            });
        }

        //refreshHandle($stateParams, $rootScope);

        $scope.votingProjectionObj = NewVotingProjectionObj();
        $scope.votingProjectionObj.QuestionType = 'QuestionType1';



        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.clientid = result;
                if ($scope.votingProjectionForm)
                    $scope.votingProjectionForm.$setPristine();
            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingProjectionObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingProjectionObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;

                var result = response;
                vm.eventid = result;


                //init the event ID
                $scope.votingProjectionObj.EventID = vm.eventid[vm.eventid.length - 1];
                if ($rootScope.loginInfo.currentEventID) {
                    $scope.votingProjectionObj.EventID = $rootScope.loginInfo.currentEventID;
                }
                $scope.eventIDChange();


                if ($scope.votingProjectionForm)
                    $scope.votingProjectionForm.$setPristine();
            });

        }

        if ($rootScope.loginInfo.currentClientID) {
            $scope.votingProjectionObj.ClientID = $rootScope.loginInfo.currentClientID;
            $scope.clientIDChange();
        }


    })();


    $scope.generalMaster("decisionGroup1");
    $scope.generalMaster("decisionGroup2");

    //projection data table
    (function () {

        var createdRow = function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        };
        var actionsHtml = function (data, type, full, meta) {

            if (!$scope.votingProjectionObj.VotingProjectionList.length) return '';

            return '<div class="DataTableDiv"><ui-select ng-model="votingProjectionObj.VotingProjectionList[' + meta.row + '].Decision" '
                + 'theme="bootstrap" '
                + 'required '
                + 'reset-search-input="true" '
                + 'title="请选择预计结果" '
                + 'name="decision"> '
                + '<ui-select-match placeholder="请输入预计结果">{{$select.selected.Desc}}</ui-select-match> '
                + '<ui-select-choices repeat="item.Code as item in generalMaster(\'decisionGroup' + data.AnswerType + '\')  | filter: $select.search"> '
                + '<div style=" word-wrap:break-word;white-space: normal;"  ng-bind-html="item.Desc | highlight: $select.search" ></div> '
                + '</ui-select-choices>  '
                + '</ui-select></div>';
        };

        $scope.dtOptions.withOption('createdRow', createdRow);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
            DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
            DTColumnBuilder.newColumn('AdminExamineConfirmSum').withTitle('债权确认金额').withClass('table-right-align').renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
            DTColumnBuilder.newColumn('Question').withTitle('问题').renderWith(function (data, type, full) {

                return "<div style='min-width:350px;'>" + full.QuestionID + ". " + full.Question + "</div>";
            }),
            DTColumnBuilder.newColumn(null).withTitle('预计结果').notSortable().renderWith(actionsHtml)
        ];
        $scope.dtInstance = {};
    })();

    $scope.eventIDChange = function () {

        $rootScope.loginInfo.currentEventID = $scope.votingProjectionObj.EventID;

        if (!$scope.votingProjectionObj.ClientID) return;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getVotingProjectionInfo",
                ClientID: $scope.votingProjectionObj.ClientID,
                CreditType: $scope.votingProjectionObj.CreditType,
                EventID: $scope.votingProjectionObj.EventID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            if (response) {
                var result = response;
                if (result.EventDescription)
                    $scope.votingProjectionObj.EventDescription = result.EventDescription;
                if (result.VotingProjectionList) {
                    $scope.votingProjectionObj.VotingProjectionList = result.VotingProjectionList;

                    $scope.dtInstance.DataTable.clear();
                    $scope.dtInstance.DataTable.rows.add($scope.votingProjectionObj.VotingProjectionList).draw();

                    $scope.votingProjectionObj.CreditType = ($scope.votingProjectionObj.CreditType || result.VotingProjectionList[0].CreditType);
                }
            }

            $scope.votingProjectionObj.CreditType = ($scope.votingProjectionObj.CreditType || "1");
        })
    }

    $scope.reset = function () {

        $.each($scope.votingProjectionObj.VotingProjectionList, function (index, value) {
            value.Decision = undefined;
        });

    }

    $scope.saveVotingProjection = function () {

        // ////console.log($scope.votingProjectionObj.VotingProjectionList);

        if ($scope.votingProjectionForm.$invalid) {

            toastr.error("请填写所有预计结果", "失敗");
            return;
        }
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "saveVotingProjection",
                creditType: $scope.votingProjectionObj.CreditType,
                VotingProjectionList: JSON.stringify($scope.votingProjectionObj.VotingProjectionList)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
        });
    }
}

export function VotingProjectionResultCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope) {
    var vm = this;

    (function () {
        $scope.clientIDChange = function (callback) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDAndCompanyName", ClientID: $scope.votingProjectionResultObj.ClientID, EventID: $scope.votingProjectionResultObj.EventID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                var clientID = $scope.votingProjectionResultObj.ClientID;
                $scope.votingProjectionResultObj = {};
                $scope.votingProjectionResultObj.ClientID = clientID;
                vm.eventids = result.EventIDList;
                vm.creditorids = result.CreditorIDList;
                if (result.CompanyName)
                    $scope.votingProjectionResultObj.CompanyName = result.CompanyName;


                if ($scope.votingProjectionResultForm)
                    $scope.votingProjectionResultForm.$setPristine();
                if (callback)
                    callback();
            });
        }

        //refreshHandle($stateParams, $rootScope);

        $scope.votingProjectionResultObj = {};

        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.clientid = result;
                $scope.votingProjectionResultForm.$setPristine();
            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingProjectionResultObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingProjectionResultObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.eventid = result;


                if ($scope.votingProjectionResultForm)
                    $scope.votingProjectionResultForm.$setPristine();
            });
        }

        if ($rootScope.loginInfo.currentClientID) {
            $scope.votingProjectionResultObj.ClientID = $rootScope.loginInfo.currentClientID;

        }


    })();

    $scope.eventIDChange = function () {
        if (!$scope.votingProjectionResultObj.ClientID) return;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getVotingProjectionResult", ClientID: $scope.votingProjectionResultObj.ClientID, EventID: $scope.votingProjectionResultObj.EventID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                if (result.EventDescription)
                    $scope.votingProjectionResultObj.EventDescription = result.EventDescription;
                if (result.VotingProjectionResultList)
                    $scope.votingProjectionResultObj.VotingProjectionResultList = result.VotingProjectionResultList;
            }
        })
    }

    if ($scope.votingProjectionResultObj.ClientID) {
        $scope.clientIDChange(function () {
            $scope.votingProjectionResultObj.EventID = $stateParams.EventID;
            if ($scope.votingProjectionResultObj.EventID)
                $scope.eventIDChange();
        });
    }


}

export function VotingCreditorGenerationCtrl($scope, $http, $timeout, $interval, toastr, DTOptionsBuilder, DTColumnBuilder, $filter) {
    //var vm = this;
    $scope.mode = 0;
    function NewVotingCreditorGenerationObj() {
        return {
            // VotingCreditorGenerationList: []
        }
    }

    //console.log($scope.loginInfo);
    (function () {
        $scope.templateFile = {
            Path: $scope.loginInfo.InvitationPath//.InvitationPath
        };
        $scope.votingCreditorGenerationObj = NewVotingCreditorGenerationObj();

        //$scope.CreditorTypeDisplay = { 0: "财产担保债权", 1: "职工债权", 2: "税务债权", 3: "普通债权" }

        $scope.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.clientid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

        $scope.refreshEventID = function (eventid) {
            if (!$scope.votingCreditorGenerationObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingCreditorGenerationObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.eventid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

    })();

    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    }

    $scope.getEventIDList =  function () { 
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getEventIDList",
                ClientID: $scope.votingCreditorGenerationObj.ClientID, 
                EventID: '',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) { 
                $scope.eventids = response;
  
                $scope.clientIDChange();
            }
        });
    }

    $scope.clientIDChange = function () {

        if(!$scope.votingCreditorGenerationObj.EventID ||  !$scope.votingCreditorGenerationObj.VoteMethod) return;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getEventIDListAndVotingCreditorGenerationList",
                ClientID: $scope.votingCreditorGenerationObj.ClientID,
                EventID: $scope.votingCreditorGenerationObj.EventID,
                VoteMethod: $scope.votingCreditorGenerationObj.VoteMethod,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.eventids = result.EventIDList;

                if ($scope.votingCreditorGenerationObj.ClientID) {

                    //$scope.votingCreditorGenerationObj.VotingCreditorGenerationList = result.VotingCreditorGenerationList;
                    $scope.VotingCreditorGenerationList = result.VotingCreditorGenerationList;
                    $scope.dtInstance.DataTable.clear();
                    $scope.dtInstance.DataTable.rows.add(result.VotingCreditorGenerationList).draw();

                    //$scope.ngChangeRecordList = new NgTableParams({}, { dataset: $scope.votingCreditorGenerationObj.VotingCreditorGenerationList });
                    //$scope.ngChangeRecordList.reload();

                }


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            }
        });

    }

    $scope.generateInvitation = function () {
        window.location = host + '/HttpHandler/ReportHandler.ashx?action=generateInvitation&ClientID=' + $scope.votingCreditorGenerationObj.ClientID
            + "&EventID=" + $scope.votingCreditorGenerationObj.EventID
            + "&VoteMethod=" + $scope.votingCreditorGenerationObj.VoteMethod;

    }

    $scope.updateTemplate = function () {
        $scope.templateFile.ClientID = $scope.votingCreditorGenerationObj.ClientID;
        $scope.templateFile.VoteMethod = $scope.votingCreditorGenerationObj.VoteMethod;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "updateTemplate",
                TemplateInfo: JSON.stringify($scope.templateFile),
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response && response.result) {

                toastr.success(response.message, "成功");
            }
        });
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
        DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
        DTColumnBuilder.newColumn('PropertySecurity').withTitle('有财产担保债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyLabour').withTitle('职工债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyTax').withTitle('税务债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('OrdinaryCreditorRight').withTitle('普通债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
    ];

    $scope.dtInstance = {};
}

export function VotingAcknowledgementGenerationCtrl($scope, $http, $timeout, $interval, toastr, DTOptionsBuilder, DTColumnBuilder, $filter) {
    //var vm = this;
    $scope.mode = 0;
    function NewVotingCreditorGenerationObj() {
        return {
        }
    }

    //console.log($scope.loginInfo);
    (function () {
        $scope.templateFile = {
            Path: $scope.loginInfo.EventAcknowledgementPath//.InvitationPath
        };
        $scope.votingCreditorGenerationObj = NewVotingCreditorGenerationObj();


        $scope.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.clientid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

        $scope.refreshEventID = function (eventid) {
            if (!$scope.votingCreditorGenerationObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingCreditorGenerationObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.eventid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

    })();

    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    }

    $scope.clientIDChange = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getEventIDListAndVotingAcknowledgementGenerationList",
                ClientID: $scope.votingCreditorGenerationObj.ClientID,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.eventids = result.EventIDList;

                if ($scope.votingCreditorGenerationObj.ClientID) {

                    //$scope.votingCreditorGenerationObj.VotingCreditorGenerationList = result.VotingCreditorGenerationList;

                    $scope.dtInstance.DataTable.clear();
                    $scope.dtInstance.DataTable.rows.add(result.VotingCreditorGenerationList).draw();

                    //$scope.ngChangeRecordList = new NgTableParams({}, { dataset: $scope.votingCreditorGenerationObj.VotingCreditorGenerationList });
                    //$scope.ngChangeRecordList.reload();

                }


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            }
        });

    }

    $scope.generateInvitation = function () {
        window.location = host + '/HttpHandler/ReportHandler.ashx?action=generateAcknowledgement&ClientID=' + $scope.votingCreditorGenerationObj.ClientID
            + "&EventID=" + $scope.votingCreditorGenerationObj.EventID;

    }

    $scope.updateTemplate = function () {
        $scope.templateFile.ClientID = $scope.votingCreditorGenerationObj.ClientID;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "updateTemplate",
                TemplateInfo: JSON.stringify($scope.templateFile),
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response && response.result) {

                toastr.success(response.message, "成功");
            }
        });
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
        DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
        DTColumnBuilder.newColumn('PropertySecurity').withTitle('有财产担保债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyLabour').withTitle('职工债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyTax').withTitle('税务债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('OrdinaryCreditorRight').withTitle('普通债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
    ];

    $scope.dtInstance = {};
}

export function LiveVotingFormGenerationCtrl($scope, $http, $timeout, $interval, toastr, DTOptionsBuilder, DTColumnBuilder, $filter) {
    //var vm = this;
    $scope.mode = 0;
    function NewVotingCreditorGenerationObj() {
        return {
        }
    }

    //console.log($scope.loginInfo);
    (function () {
        $scope.templateFile = {
            Path: $scope.loginInfo.LiveVotingFormPath//.InvitationPath
        };
        $scope.votingCreditorGenerationObj = NewVotingCreditorGenerationObj();


        $scope.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.clientid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

        $scope.refreshEventID = function (eventid) {
            if (!$scope.votingCreditorGenerationObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingCreditorGenerationObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                $scope.eventid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

    })();

    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    }

    $scope.clientIDChange = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getEventIDListAndLiveVotingFormList",
                ClientID: $scope.votingCreditorGenerationObj.ClientID,
                EventID: $scope.votingCreditorGenerationObj.EventID || 0,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.eventids = result.EventIDList;

                if ($scope.votingCreditorGenerationObj.ClientID) {

                    //$scope.votingCreditorGenerationObj.VotingCreditorGenerationList = result.VotingCreditorGenerationList;

                    $scope.dtInstance.DataTable.clear();
                    $scope.dtInstance.DataTable.rows.add(result.VotingCreditorGenerationList).draw();

                    //$scope.ngChangeRecordList = new NgTableParams({}, { dataset: $scope.votingCreditorGenerationObj.VotingCreditorGenerationList });
                    //$scope.ngChangeRecordList.reload();

                }


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            }
        });

    }

    $scope.generateInvitation = function () {
        window.location = host + '/HttpHandler/ReportHandler.ashx?action=generateLiveVotingForm&ClientID=' + $scope.votingCreditorGenerationObj.ClientID
            + "&EventID=" + $scope.votingCreditorGenerationObj.EventID;

    }

    $scope.updateTemplate = function () {
        $scope.templateFile.ClientID = $scope.votingCreditorGenerationObj.ClientID;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "updateTemplate",
                TemplateInfo: JSON.stringify($scope.templateFile),
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response && response.result) {

                toastr.success(response.message, "成功");
            }
        });
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
        DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
        DTColumnBuilder.newColumn('PropertySecurity').withTitle('有财产担保债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyLabour').withTitle('职工债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('PropertyTax').withTitle('税务债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
        DTColumnBuilder.newColumn('OrdinaryCreditorRight').withTitle('普通债权').withClass('table-right-align').renderWith(function (data, type, full) {
            return $filter('currency')(data, '', 2);
        }),
    ];

    $scope.dtInstance = {};
}

export function DocumentInquiryCtrl($scope, $http, $timeout, $interval) {
    var vm = this;

    function NewDocumentInquiryObj() {
        return {
            // DocumentInquiryList: []
        };
    }

    (function () {
        $scope.documentInquiryObj = NewDocumentInquiryObj();


        // $scope.displayField = {
        //     attType: generalMasterToDictionary($scope.selection.AttType)
        // }

        //$scope.displayField = (function () {
        //    return {
        //        attType: {
        //            1: "附件类型1",
        //            2: "附件类型2",
        //            3: "附件类型3"
        //        }
        //    }
        //})();

        // vm.refreshClientID = function (clientid) {
        //     $http({
        //         method: 'POST', withCredentials: true,
        //         url: host + '/HttpHandler/AjaxHandler.ashx',
        //         data: $.param({ action: "getClientIDList", ClientID: clientid }),
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //     }).then(function (response) {
        //         response = response.data;

        //         ////console.log(response);
        //         var result = response;
        //         vm.clientid = result;
        //         $scope.documentInquiryForm.$setPristine();
        //     });
        // };

        // vm.refreshCreditorID = function (creditorid) {
        //     if (!$scope.documentInquiryObj.ClientID) {
        //         vm.creditorids = [];
        //         return;
        //     }
        //     $http({
        //         method: 'POST', withCredentials: true,
        //         url: host + '/HttpHandler/AjaxHandler.ashx',
        //         data: $.param({ action: "getCreditorIDList", ClientID: $scope.documentInquiryObj.ClientID, CreditorID: creditorid }),
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //     }).then(function (response) {
        //         response = response.data;
        //         var result = response;
        //         if (creditorid)
        //             result.unshift(creditorid);
        //         vm.creditorids = result;
        //         $scope.documentInquiryForm.$setPristine();
        //     });
        // }

    })();

    $scope.clientIDChange = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getCreditorIDList", ClientID: $scope.documentInquiryObj.ClientID, CreditorID: $scope.documentInquiryObj.CreditorID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            var result = response;
            var clientID = $scope.documentInquiryObj.ClientID;
            $scope.documentInquiryObj = NewDocumentInquiryObj();
            $scope.total = {};
            $scope.documentInquiryObj.ClientID = clientID;
            vm.creditorids = result;
        });
    }

    $scope.search = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getDocumentInquiryList", ClientID: $scope.documentInquiryObj.ClientID,
                CreditorID: $scope.documentInquiryObj.CreditorID,
                AttName: $scope.documentInquiryObj.AttName,
                AttType: $scope.documentInquiryObj.AttType,
                AttRemark: $scope.documentInquiryObj.AttRemark
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.documentInquiryObj.DocumentInquiryList = result;
            }
            if (response.message)
                alert(response.message);
        });
    }

    $scope.reset = function () {
        $scope.documentInquiryObj = NewDocumentInquiryObj();
        vm.refreshCreditorID('');

    }
}

export function VotingFormGenerationCtrl($scope, $http, $timeout, $interval) {
    var vm = this;

    function NewVotingFormGenerationObj() {
        return {
            VotingFormGenerationList: []
        };
    }

    (function () {
        $scope.votingFormGenerationObj = NewVotingFormGenerationObj();

        // $scope.displayField = {
        //     attType: generalMasterToDictionary($scope.selection.AttType)
        // }

        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.clientid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingCreditorGenerationObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingCreditorGenerationObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.eventid = result;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            });
        }

    })();

    $scope.clientIDChange = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getEventIDListAndVotingFormGenerationList", 
            ClientID: $scope.votingFormGenerationObj.ClientID, 
            EventID: $scope.votingFormGenerationObj.EventID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                vm.eventids = result.EventIDList;
                $scope.votingFormGenerationObj.VotingFormGenerationList = result.VotingFormGenerationList;


                if ($scope.votingCreditorGenerationForm)
                    $scope.votingCreditorGenerationForm.$setPristine();
            }
        });
    }

}

export function CreditorAmountReportCtrl($scope, $http, $timeout, $interval) {
    var vm = this;


    (function () {
        $scope.CreditorAmountReportObj = {};

        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.clientid = result;

            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.CreditorAmountReportObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.CreditorAmountReportObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                vm.eventid = result;


            });
        }

    })();

    $scope.clientIDChange = function () {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getEventIDList", ClientID: $scope.CreditorAmountReportObj.ClientID, EventID: $scope.CreditorAmountReportObj.EventID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            console.log(response);
            response = response.data;
            if (response) {
                var result = response;
                vm.eventids = result;

            }
        });
    }


    $scope.generateCreditorAmountReport = function () {

        if ($scope.votingFormGenerationForm.$invalid) return;
        window.location = host + '/HttpHandler/ReportHandler.ashx?action=generateCreditorAmountReport&ClientID=' +
            $scope.CreditorAmountReportObj.ClientID;
    }

}

export function LiveVoteResultCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope) {
    var vm = this;

    //refreshHandle($stateParams, $rootScope);

    $scope.liveVoteResultObj = {};
    $scope.liveVoteResultObj.ClientID = $stateParams.ID;
    $scope.liveVoteResultObj.EventID = $stateParams.EventID;

    (function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "getVotingQuestionList", ClientID: $scope.liveVoteResultObj.ClientID, EventID: $scope.liveVoteResultObj.EventID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            // //console.log(response);

            $scope.QuestionList = response;
            $scope.QuestionDict = {};
            for (var i = 0, item; item = $scope.QuestionList[i]; i++) {
                $scope.QuestionDict[item.QuestionID] = item.AnswerType;
            }

            $interval(function () {
                $http({
                    method: 'POST', withCredentials: true,
                    url: host + "/HttpHandler/AjaxHandler.ashx",
                    data: $.param({ action: "GetVotingResultList", ClientID: $scope.liveVoteResultObj.ClientID, EventID: $scope.liveVoteResultObj.EventID }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function (response) {
                    response = response.data;

                    buildChart(response);
                });
            }, 3000);


        });

    })();

    var lineBreakTitle = function (title, type) {

        if (title.length > 22) {
            title = title.substring(0, 22) + "<br>" + title.substring(22) + " " + type;
        } else {
            title = title + "<br>" + type;
        }
        return title;
    }

    var buildChart = function (result) {


        // //console.log(result);

        $scope.charts = [];
        $scope.charts2 = [];
        var tmpX, tmpY, tmpAnnotations, tmpYAmount;
        for (var i = 0, item; item = result[i]; i++) {
            var tmp = {};

            if ($scope.QuestionDict[item.QuestionID] == "2") {
                tmpX = ['赞成', '反对', '弃权'];
                tmpY = [item.AgressNo, item.DisagressNo, item.AbstentionNo];
                tmpYAmount = [item.AgreeAmt, item.DisagreeAmt, item.AbstentionAmt];
                tmpAnnotations = [
                    {
                        font: {
                            size: 18
                        },
                        showarrow: false,
                        text: item.AgressNo,
                        x: 0,
                        y: 0.2 + item.AgressNo
                    },
                    {
                        font: {
                            size: 18
                        },
                        showarrow: false,
                        text: item.DisagressNo,
                        x: 1,
                        y: 0.2 + item.DisagressNo
                    },
                    {
                        font: {
                            size: 18
                        },
                        showarrow: false,
                        text: item.AbstentionNo,
                        x: 2,
                        y: 0.2 + item.AbstentionNo
                    },
                ];
            }
            else {
                tmpX = ['赞成', '反对'];
                tmpY = [item.AgressNo, item.DisagressNo];
                tmpYAmount = [item.AgreeAmt, item.DisagreeAmt];
                tmpAnnotations = [
                    {
                        font: {
                            size: 18
                        },
                        showarrow: false,
                        text: item.AgressNo,
                        x: 0,
                        y: 0.2 + item.AgressNo
                    },
                    {
                        font: {
                            size: 18
                        },
                        showarrow: false,
                        text: item.DisagressNo,
                        x: 1,
                        y: 0.2 + item.DisagressNo
                    },
                ];
            }

            tmp.data = [{
                x: tmpX,
                y: tmpY,
                marker: { color: ["Green", "Red", "Blue"] },
                // labels: ['123', '321', '333'],
                type: "bar",
                hoverinfo: 'none',
                //textposition: 'auto', 
                text: [item.AgressNo, item.DisagressNo, item.AbstentionNo],
                marker: {
                    color: ["Green", "Red", "Blue"],
                    opacity: 0.2,
                }
            },
            ];

            tmp.layout = {
                title: lineBreakTitle(item.Question, "(票数)"),
                margin: { t: 80, b: 40, l: 40, r: 40 },
                annotations: tmpAnnotations,
            };
            tmp.options = { showLink: false, displayLogo: false };
            $scope.charts.push(tmp);

            var tmp = {};
            tmp.data = [{
                x: tmpX,
                y: tmpYAmount,
                marker: { color: ["Green", "Red", "Blue"] },
                // labels: ['123', '321', '333'],
                type: "bar",
                //orientation: "v"
            },
            ];

            tmp.layout = {
                title: lineBreakTitle(item.Question, "(金额)"),
                margin: { t: 80, b: 40, l: 40, r: 40 },
                annotations: [
                    {
                        font: {
                            size: 20
                        },
                        showarrow: false,
                        text: '',
                        x: 0.17,
                        y: 0.5
                    },
                ],
            };
            $scope.charts2.push(tmp);
        }

    }


}

export function LiveVotePageCtrl($scope, $rootScope, $stateParams, $http, $state, $timeout) {
    var vm = this;

    //refreshHandle($stateParams, $rootScope);

    (function () {
        $scope.liveVotePageObj = {};
        $scope.liveVotePageObj.ClientID = $stateParams.ID;
        $scope.liveVotePageObj.EventID = $stateParams.EventID;
        $scope.cleanQuestionList;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getLiveVotingInfo",
                ClientID: $scope.liveVotePageObj.ClientID,
                EventID: $scope.liveVotePageObj.EventID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.liveVotePageObj.liveVoteQuestionList = result.LiveVoteQuestionList;
                $scope.cleanQuestionList = result.LiveVoteQuestionList;
                $scope.liveVotePageObj.EventDescription = result.EventDescription;

            }
        });


    })();

    $scope.creditorIDChange = function (callback) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getCreditorVotingDetails",
                ClientID: $scope.liveVotePageObj.ClientID,
                CreditorID: $scope.liveVotePageObj.CreditorID,
                EventID: $scope.liveVotePageObj.EventID,
                CreditType: $scope.liveVotePageObj.CreditType,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            console.log(response);
            if (response) {
                $scope.liveVotePageObj.CreditorName = response.CreditorName;


                $scope.CreditTypeMaster = [];
                if (response.CreditorVotingInfo && response.CreditorVotingInfo.length) {
                    $.each(response.CreditorVotingInfo, function (index, value) {
                        $scope.CreditTypeMaster.push({ Code: value[1], Desc: value[2] });
                    });

                }

                if (response.CreditorIDNo)
                    $scope.liveVotePageObj.CreditorIDNo = response.CreditorIDNo;
                if (response.VotingDetails.length) {
                    $scope.liveVotePageObj.liveVoteQuestionList = response.VotingDetails;
                    $scope.liveVotePageObj.voted = true;
                    //voted

                    var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                    $scope.voteHistory.unshift({
                        content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') ' + response.message + '.',
                        date: logDateTime,
                        statusClass: 'warning',
                        tagName: 'Warning'
                    });

                } else {
                    $scope.liveVotePageObj.liveVoteQuestionList = $scope.cleanQuestionList;
                    $scope.liveVotePageObj.voted = false;
                }

            }

            if (callback)
                callback(response);
        })

    }
    $scope.submitVote = function () {

        for (var i = 0; i < $scope.liveVotePageObj.liveVoteQuestionList.length; i++) {
            if (!$scope.liveVotePageObj.liveVoteQuestionList[i].Decision || !$scope.liveVotePageObj.CreditType) {
                //alert("请表决所有事项");
                return;
            }
        }
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "submitVote",
                ClientID: $scope.liveVotePageObj.ClientID,
                CreditorID: $scope.liveVotePageObj.CreditorID,
                EventID: $scope.liveVotePageObj.EventID,
                CreditType: $scope.liveVotePageObj.CreditType,
                liveVoteQuestionList: JSON.stringify($scope.liveVotePageObj.liveVoteQuestionList)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            //alert(response.message);
            $scope.liveVotePageObj.voted = true;
            //$state.go('login');
            //Time out session

            var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
            if (response.status == "1")
                $scope.voteHistory.unshift({
                    content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') ' + response.message + '.',
                    date: logDateTime,
                    statusClass: 'success',
                    tagName: 'Success'
                });
            else
                $scope.voteHistory.unshift({
                    content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') ' + response.message + '.',
                    date: logDateTime,
                    statusClass: 'danger',
                    tagName: 'Failure'
                });



        })

    }

    //$scope.todoList = [];
    $scope.voteHistory = [];
    $scope.takeAttendance = function (barcode) {

        var inputs;
        if ($scope.manual) {
            inputs = [
                $scope.liveVotePageObj.ClientID,
                $scope.liveVotePageObj.EventID,
                $scope.liveVotePageObj.CreditorID,
            ]
        } else {
            inputs = barcode.split("/");
        }

        console.log(inputs);

        if ((inputs.length < 4) || inputs[1] != $scope.liveVotePageObj.EventID || inputs[0] != $scope.liveVotePageObj.ClientID) {
            var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
            $scope.voteHistory.unshift({
                content: 'QR Code 不正確',
                date: logDateTime,
                statusClass: 'danger',
                tagName: 'Failure'
            });

            if ($scope.voteHistory.length > 10) {
                $scope.voteHistory.pop();
            }
            return;
        }


        $scope.liveVotePageObj.CreditorID = inputs[2].trim();
        $scope.liveVotePageObj.CreditType = inputs[3].trim();

        $scope.attendanceObj = {
            ClientID: $scope.liveVotePageObj.ClientID,
            EventID: $scope.liveVotePageObj.EventID,
            CreditorID: $scope.liveVotePageObj.CreditorID,
            CreditType: $scope.liveVotePageObj.CreditType,
        };

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "takeAttendance",
                AttendanceInfo: JSON.stringify($scope.attendanceObj)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            //console.log(response);
            var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
            var msgObj;
            if (response) {
                // $scope.liveVotePageObj.CreditorName = response.CreditorName;
                // $scope.liveVotePageObj.CreditorIDNo = response.CreditorIDNo;
                // msgObj = {
                //     content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') 登記成功.',
                //     date: logDateTime,
                //     statusClass: 'success',
                //     tagName: 'Success'
                // };

            }
            else {
                msgObj = {
                    content: '债权编号 (' + $scope.liveVotePageObj.CreditorID + ') 不正確',
                    date: logDateTime,
                    statusClass: 'danger',
                    tagName: 'Failure'
                };
            }

            if (msgObj)
                $scope.voteHistory.unshift(msgObj);

            if ($scope.voteHistory.length > 10) {
                $scope.voteHistory.pop();
            }


            $scope.creditorIDChange();

        })

    }

    var pressed = false;
    var chars = [];

    if (!$scope.keyPressListener)
        $scope.keyPressListener = $scope.$on('keypress', function (e, a, key) {
            $scope.$apply(function () {

                if ($scope.manual) return;
                chars.push(key);
                ////console.log(key + ":" + chars.join("|"));

                if (pressed == false) {
                    pressed = true;

                    var promise = $timeout(function () {

                        if (chars.length > 10) {
                            var barcode = chars.join("");
                            ////console.log("Barcode Scanned: " + barcode);
                            $scope.takeAttendance(barcode);
                        }

                        // Stop the pending timeout
                        $timeout.cancel(promise);
                        chars.length = 0;
                        pressed = false;

                    }, 500);

                }
                // set press to true so we do not reenter the timeout function above
                pressed = true;
            });
        });

    // Unregister
    $scope.$on('$destroy', function () {
        $scope.keyPressListener();
    });



}

export function UnVoteListCtrl($scope, $rootScope, $stateParams, $http, $state, $timeout, DTColumnBuilder, $filter) {
    var vm = this;


    (function () {
        $scope.unVoteObj = {};
        $scope.unVoteObj.ClientID = $stateParams.ID;
        $scope.unVoteObj.EventID = $stateParams.EventID;
        $scope.cleanQuestionList;

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getLiveVotingInfo",
                ClientID: $scope.unVoteObj.ClientID,
                EventID: $scope.unVoteObj.EventID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.unVoteObj.EventDescription = result.EventDescription;

            }
        });

    })();


    //data table
    (function () {
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('CreditorID').withTitle('债权人编号'),
            DTColumnBuilder.newColumn('CreditorName').withTitle('债权人姓名'),
            DTColumnBuilder.newColumn('CreditTypeDesc').withTitle('债权类别'),
            DTColumnBuilder.newColumn('AdminExamineConfirm').withTitle('债权确认金额').withClass('table-right-align').renderWith(function (data, type, full) {
                return $filter('currency')(data, '', 2);
            }),
        ];
        $scope.dtInstance = {};



    })();

    $scope.search = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "SearchUnVoteCreditor",
                ClientID: $scope.unVoteObj.ClientID,
                EventID: $scope.unVoteObj.EventID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                if (response.message)
                    alert(response.message);

                var result = response.UnVoteCreditorList;
                $scope.dtInstance.DataTable.clear();
                $scope.dtInstance.DataTable.rows.add(result).draw();
            }
        });

    }
    $scope.search();


}

export function AttendanceScanCtrl($scope, $rootScope, $stateParams, $http, $state, $timeout) {
    var vm = this;

    //refreshHandle($stateParams, $rootScope);

    (function () {
        $scope.liveVotePageObj = {};
        $scope.liveVotePageObj.ClientID = $stateParams.ID;
        $scope.liveVotePageObj.EventID = $stateParams.EventID;
        $scope.cleanQuestionList;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getLiveVotingInfo",
                ClientID: $scope.liveVotePageObj.ClientID,
                EventID: $scope.liveVotePageObj.EventID
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.liveVotePageObj.liveVoteQuestionList = result.LiveVoteQuestionList;
                $scope.cleanQuestionList = result.LiveVoteQuestionList;
                $scope.liveVotePageObj.EventDescription = result.EventDescription;

            }
        });
    })();

    $scope.creditorIDChange = function (barcode) {
        var inputs;
        if ($scope.manual) {
            inputs = [
                $scope.liveVotePageObj.ClientID,
                $scope.liveVotePageObj.EventID,
                $scope.liveVotePageObj.CreditorID,
            ]
        } else {
            inputs = barcode.split("/");
        }

        ////console.log(inputs);

        if ((inputs.length < 3) || inputs[1] != $scope.liveVotePageObj.EventID || inputs[0] != $scope.liveVotePageObj.ClientID) {
            var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
            $scope.todoList.unshift({
                content: 'QR Code 不正確',
                date: logDateTime,
                statusClass: 'danger',
                tagName: 'Failure'
            });

            if ($scope.todoList.length > 10) {
                $scope.todoList.pop();
            }
            return;
        }

        $scope.liveVotePageObj.CreditorID = inputs[2].trim();

        if (!$scope.liveVotePageObj.CreditorID) return;

        $scope.getVotingReplyEntry();

    }

    $scope.getVotingReplyEntry = function (callback) {
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "getSimpleVotingReplyEntry",
                ClientID: $scope.liveVotePageObj.ClientID,
                EventID: $scope.liveVotePageObj.EventID,
                CreditorID: $scope.liveVotePageObj.CreditorID,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);
            if (response) {
                $scope.liveVotePageObj.CreditorName = response.CreditorName;
                $scope.liveVotePageObj.CreditorIDNo = response.CreditorIDNo;
                $scope.canVote = true;

                //if (!$scope.manual && !$scope.isAgency) {

                //    var promise = $timeout(function () {
                //        $scope.takeAttendance();
                //        $timeout.cancel(promise);
                //    }, 1);

                //}

                //prevent the online voting creditor to take attendance
                if (response.VoteMethod == "1") {
                    $scope.canVote = false;
                    var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                    var msgObj;
                    msgObj = {
                        content: '债权编号 (' + $scope.liveVotePageObj.CreditorID + ') 已选择网上投票',
                        date: logDateTime,
                        statusClass: 'danger',
                        tagName: 'Failure'
                    };
                    $scope.todoList.unshift(msgObj);
                    if ($scope.todoList.length > 10) {
                        $scope.todoList.pop();
                    }
                }
            }
            else {
                $scope.canVote = false;
                var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
                var msgObj;
                msgObj = {
                    content: '债权编号 (' + $scope.liveVotePageObj.CreditorID + ') 不正確',
                    date: logDateTime,
                    statusClass: 'danger',
                    tagName: 'Failure'
                };
                $scope.todoList.unshift(msgObj);
                if ($scope.todoList.length > 10) {
                    $scope.todoList.pop();
                }
            }

            if (callback) {
                callback(response);
            }
        })

    }


    $scope.todoList = [];
    $scope.voteHistory = [];
    $scope.takeAttendance = function () {

        if ($scope.attendanceScanForm.$invalid) return;

        //start take attendance 
        $scope.attendanceObj = {
            ClientID: $scope.liveVotePageObj.ClientID,
            EventID: $scope.liveVotePageObj.EventID,
            CreditorID: $scope.liveVotePageObj.CreditorID,
            CreditAgent: $scope.liveVotePageObj.CreditAgent,
            CreditAgentIDNo: $scope.liveVotePageObj.CreditAgentIDNo,
        };
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({
                action: "takeAttendance",
                AttendanceInfo: JSON.stringify($scope.attendanceObj)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            ////console.log(response);

            var logDateTime = moment.utc().local().format('YYYY-MM-DD HH:mm:ss');
            var msgObj;

            if (response && response.status == "1") {
                msgObj = {
                    content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') 登記成功.',
                    date: logDateTime,
                    statusClass: 'success',
                    tagName: 'Success'
                };
            } else if (response && response.status == "2") {
                msgObj = {
                    content: $scope.liveVotePageObj.CreditorName + ' (' + $scope.liveVotePageObj.CreditorID + ') 登記重複.',
                    date: logDateTime,
                    statusClass: 'danger',
                    tagName: 'Failure'
                };
            } else {
                if (response && response.message) {
                    alert(response.message);
                    return;
                }
            }

            $scope.todoList.unshift(msgObj);
            if ($scope.todoList.length > 10) {
                $scope.todoList.pop();
            }

        })

    }

    var pressed = false;
    var chars = [];

    if (!$scope.keyPressListener)
        $scope.keyPressListener = $scope.$on('keypress', function (e, a, key) {
            $scope.$apply(function () {

                if ($scope.manual) return;
                chars.push(key);
                ////console.log(key + ":" + chars.join("|"));

                if (pressed == false) {
                    pressed = true;

                    var promise = $timeout(function () {

                        if (chars.length > 10) {
                            var barcode = chars.join("");
                            ////console.log("Barcode Scanned: " + barcode);
                            $scope.creditorIDChange(barcode);
                        }

                        // Stop the pending timeout
                        $timeout.cancel(promise);
                        chars.length = 0;
                        pressed = false;

                    }, 500);

                }
                // set press to true so we do not reenter the timeout function above
                pressed = true;
            });
        });

    // Unregister
    $scope.$on('$destroy', function () {
        $scope.keyPressListener();
    });



}

export function OnlineVotePageCtrl($scope, $rootScope, $stateParams, $http, $state) {
    var vm = this;

    (function () {
        $scope.onlineVotePageObj = {};
        var id = $stateParams.id;
        var token = $stateParams.token;

        if (!id || !token) {
            alert("连结无效");

            return;
        }

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/OnlineVoteHandler.ashx',
            data: $.param({ action: "getOnlineVotingInfo", ID: id, Token: token }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            // //console.log(response);
            if (response) {
                var result = response;
                $scope.onlineVotePageObj.ClientID = result.ClientID;
                $scope.onlineVotePageObj.CreditorID = result.CreditorID;
                $scope.onlineVotePageObj.EventID = result.EventID;
                $scope.onlineVotePageObj.EventDescription = result.EventDescription;
                $scope.onlineVotePageObj.CreditorName = result.CreditorName;
                $scope.onlineVotePageObj.CreditType = result.CreditType;
                $scope.onlineVotePageObj.CreditTypeDesc = result.CreditTypeDesc;
                $scope.onlineVotePageObj.OnlineVoteQuestionList = result.OnlineVoteQuestionList;
                $scope.onlineVotePageObj.IsExisted = result.IsExisted == "False" ? false : true;
                if ($scope.onlineVotePageObj.IsExisted) {
                    $rootScope.message = "已投票";
                    $state.go('index_Online.OnlineVoteSuccess');
                }
                else if (result.IsOutOfTimeRange == "True") {
                    $rootScope.message = "投票活动已过期";
                    $state.go('index_Online.OnlineVoteSuccess');
                }

            }
        });
    })();

    $scope.submitVote = function () {
        for (var i = 0; i < $scope.onlineVotePageObj.OnlineVoteQuestionList.length; i++) {
            if (!$scope.onlineVotePageObj.OnlineVoteQuestionList[i].Decision) {
                return;
            }
        }
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/OnlineVoteHandler.ashx',
            data: $.param({
                action: "submitVote",
                ClientID: $scope.onlineVotePageObj.ClientID,
                CreditorID: $scope.onlineVotePageObj.CreditorID,
                CreditType: $scope.onlineVotePageObj.CreditType,
                CreditorIDNo: $scope.onlineVotePageObj.CreditorIDNo,
                EventID: $scope.onlineVotePageObj.EventID,
                OnlineVoteQuestionList: JSON.stringify($scope.onlineVotePageObj.OnlineVoteQuestionList)
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            $rootScope.message = response.message;
            $state.go('index_Online.OnlineVoteSuccess');
            //Time out session
        })

    }

}

export function CurrencyMasterCtrl($scope, $http, $timeout, $interval, toastr) {

    function NewCurrencyObj() {
        return {
            CurrencyList: []
        };
    }

    (function () {

        $scope.currencyObj = NewCurrencyObj();

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: 'getCurrencyList' }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.currencyObj.CurrencyList = result;
            }
        });

    })();

    $scope.addCurrency = function () {
        $scope.currencyObj.CurrencyList.push({});


        if ($scope.currencyForm)
            $scope.currencyForm.$setPristine();
    }

    $scope.removeCurrency = function ($index) {
        delete $scope.currencyObj.CurrencyList.splice($index, 1);


        if ($scope.currencyForm)
            $scope.currencyForm.$setPristine();
    }

    $scope.save = function () {
        if ($scope.currencyForm.$invalid) return;
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "saveCurrency", currencyList: JSON.stringify($scope.currencyObj.CurrencyList) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
        });
    }


}

export function ComboValueMasterCtrl($scope, $http, $timeout, $interval, toastr) {
    var vm = this;

    function NewComboValueObj() {
        return {
            ComboValueList: []
        };
    }

    (function () {
        $scope.comboValueObj = NewComboValueObj();
        $scope.selection = {};
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getComboValuelCategoryList" }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.selection.CategoryList = result;
            }
        });

    })();

    $scope.comboValueChange = function () {

        $($scope.selection.CategoryList).each(function (index, value) {
            if (value.Category == $scope.comboValueObj.Category)
                $scope.comboValueObj.CategoryDesc = value.CategoryDesc;
            return;
        });

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "getComboValue", Categories: JSON.stringify([$scope.comboValueObj.Category]) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            if (response) {
                var result = response;
                $scope.comboValueObj.ComboValueList = result[$scope.comboValueObj.Category];

            }
        });
    }

    $scope.addComboValue = function () {
        $scope.comboValueObj.ComboValueList.push({});
    }

    $scope.save = function () {
        if ($scope.comboValueMasterForm.$invalid) return;

        $.each($scope.comboValueObj.ComboValueList, function (index, value) {
            value.ChiDesc = value.txt;
        });
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "saveComboValue", Category: $scope.comboValueObj.Category, CategoryDesc: $scope.comboValueObj.CategoryDesc, ComboValueList: JSON.stringify($scope.comboValueObj.ComboValueList) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
        });
    }
}

export function GenerateOnlineVotingCtrl($scope, $http, $timeout, $interval, $stateParams, $rootScope, toastr) {
    var vm = this;

    function NewVotingReplyEntryObj() {
        return {
            CreditorAuditDetailList: []
        };
    }

    function GetVotingReplyEntryInfo() {
        $http({
            method: 'POST', withCredentials: true,
            url: host + "/HttpHandler/AjaxHandler.ashx",
            data: $.param({ action: "getVotingReplyEntryInfo", ClientID: $scope.votingReplyEntryObj.ClientID, EventID: $scope.votingReplyEntryObj.EventID, CreditorID: $scope.votingReplyEntryObj.CreditorID }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;

            if (response.VotingReplyEntryInfo) {
                var result = response.VotingReplyEntryInfo;
                $scope.votingReplyEntryObj = result;
            }
            else {
                var ClientID = $scope.votingReplyEntryObj.ClientID;
                var EventID = $scope.votingReplyEntryObj.EventID;
                var CreditorID = $scope.votingReplyEntryObj.CreditorID;
                $scope.votingReplyEntryObj = NewVotingReplyEntryObj();
                $scope.votingReplyEntryObj.ClientID = ClientID;
                $scope.votingReplyEntryObj.EventID = EventID;
                $scope.votingReplyEntryObj.CreditorID = CreditorID;
            }

            if (response.CreditorAuditDetailList) {
                $scope.votingReplyEntryObj.CreditorAuditDetailList = response.CreditorAuditDetailList;
            }

            if (response.CreditorInfo) {
                if (response.CreditorInfo.CreditorName)
                    $scope.votingReplyEntryObj.CreditorName = response.CreditorInfo.CreditorName;
                if (response.CreditorInfo.ResponsiblePerson)
                    $scope.votingReplyEntryObj.ResponsiblePerson = response.CreditorInfo.ResponsiblePerson;
            }
        })
    }

    (function () {
        $scope.clientIDChange = function () {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDAndCreditorIDList", ClientID: $scope.votingReplyEntryObj.ClientID, EventID: $scope.votingReplyEntryObj.EventID, CreditorID: $scope.votingReplyEntryObj.CreditorID }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                var result = response;
                var clientID = $scope.votingReplyEntryObj.ClientID;
                $scope.votingReplyEntryObj = NewVotingReplyEntryObj();
                $scope.votingReplyEntryObj.ClientID = clientID;
                vm.eventids = result.EventIDList;
                vm.creditorids = result.CreditorIDList;


                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        //refreshHandle($stateParams, $rootScope);

        $scope.votingReplyEntryObj = NewVotingReplyEntryObj();



        vm.refreshClientID = function (clientid) {
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getClientIDList", ClientID: clientid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.clientid = result;
                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        vm.refreshEventID = function (eventid) {
            if (!$scope.votingReplyEntryObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getEventIDList", ClientID: $scope.votingReplyEntryObj.ClientID, EventID: eventid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.eventid = result;

                //init the event ID
                $scope.votingReplyEntryObj.EventID = vm.eventid[vm.eventid.length - 1];
                if ($rootScope.loginInfo.currentEventID) {
                    $scope.votingReplyEntryObj.EventID = $rootScope.loginInfo.currentEventID;
                }

                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        vm.refreshCreditorID = function (creditorid) {
            if (!$scope.votingReplyEntryObj.ClientID) return;
            $http({
                method: 'POST', withCredentials: true,
                url: host + '/HttpHandler/AjaxHandler.ashx',
                data: $.param({ action: "getCreditorIDList", ClientID: $scope.votingReplyEntryObj.ClientID, CreditorID: creditorid }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                response = response.data;
                ////console.log(response);
                var result = response;
                vm.creditorids = result;

                if ($scope.votingReplyEntryForm)
                    $scope.votingReplyEntryForm.$setPristine();
            });
        }

        if ($rootScope.loginInfo.currentClientID) {
            $scope.votingReplyEntryObj.ClientID = $rootScope.loginInfo.currentClientID;
            $scope.clientIDChange();
        }

    })();



    $scope.eventIDChange = function () {
        $rootScope.loginInfo.currentEventID = $scope.votingReplyEntryObj.EventID;

        if (!$scope.votingReplyEntryObj.ClientID || !$scope.votingReplyEntryObj.CreditorID) return;

        GetVotingReplyEntryInfo();
    }

    $scope.creditorIDChange = function () {
        if (!$scope.votingReplyEntryObj.ClientID || !$scope.votingReplyEntryObj.EventID) return;
        GetVotingReplyEntryInfo();
    }

    $scope.saveVotingReplyEntry = function () {
        if ($scope.votingReplyEntryForm.$invalid) return;
        //dateFieldValueMask($scope, "save");
        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/AjaxHandler.ashx',
            data: $.param({ action: "saveVotingReplyEntry", VotingReplyEntryInfo: JSON.stringify($scope.votingReplyEntryObj) }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            toastr.success(response.message, "成功");
        });
    }

    $scope.generate = function () {

        $http({
            method: 'POST', withCredentials: true,
            url: host + '/HttpHandler/OnlineVOteHandler.ashx',
            data: $.param({
                action: "generateOnlineVotingToken",
                ClientID: $scope.votingReplyEntryObj.ClientID,
                CreditorID: $scope.votingReplyEntryObj.CreditorID,
                EventID: $scope.votingReplyEntryObj.EventID,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            response = response.data;
            //toastr.success(response.message, "成功");
            $scope.tokenList = response.tokenList;
            console.log(response);


            // if (response.token) {
            //     window.open("/#!/index_Online/OnlineVotePage/" + response.token);
            // }

        });

    }

}
