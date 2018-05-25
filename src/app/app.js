
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
// import './css/animate.css';
import './css/style.css';
import './css/plugins/datapicker/bootstrap-datetimepicker.min.css';
import 'ui-select/dist/select.min.css';
import './css/plugins/iCheck/custom.css'
import './css/app.css';
import "./css/plugins/dataTables/datatables.min.css";
import "./css/plugins/toastr/angular-toastr.min.css";

import 'bootstrap';
import 'metisMenu';
import 'jquery-slimscroll';
import './js/plugins/datapicker/bootstrap-datetimepicker.min.js'
import 'icheck'
import "./js/plugins/dataTables/jquery.dataTables.min.js";

// import 'pace-js';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import uibootstrap from 'angular-ui-bootstrap';
//import 'angularjs-toaster'
import datatables from "./js/plugins/dataTables/angular-datatables.min.js"

import angularsanitize from 'angular-sanitize';
import uiselect from 'ui-select';
//import * as toastr from '"./js/plugins/toastr/angular-toastr.tpls.min.js"';
import './js/plugins/toastr/angular-toastr.tpls.min.js';

import routing from './config';
import * as directive from './directive';
import * as controller from './controller';

//console.log(toaster);
//$(window).keydown(function (e) { if (e.keyCode == 32) debugger; });

// Minimalize menu when screen is less than 768px
$(function () {
    $(window).bind("load resize", function () {
        if ($(document).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    })
})

angular.module('app', [uirouter, uibootstrap, 'toastr', angularsanitize, uiselect, datatables])
    .config(["$stateProvider", "$urlRouterProvider", routing])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('responseObserver');
    }])
    .factory('responseObserver', ["$q", "$window", function responseObserver($q, $window) {
        return {
            'responseError': function (errorResponse) {
                switch (errorResponse.status) {
                    case 403:
                        "$window".location = '/';
                        break;
                    case 500:
                        "$window".location = '/';
                        break;
                }
                return $q.reject(errorResponse);
            }
        };
    }])

    //directive
    .directive('topnavbar', directive.topnavbar)
    .directive('navigation', directive.navigation)
    .directive('footer', directive.footer)
    .directive('sideNavigation', ["$timeout", directive.sideNavigation])
    .directive('minimalizaSidebar', ["$timeout", directive.minimalizaSidebar])
    .directive('icheck', ["$timeout", directive.icheck])
    .directive('dateTime', directive.dateTime)
    .directive('datePicker', directive.datePicker)
    .directive("fileread", directive.fileread)
    .directive("uiNumberMask", ["$filter", directive.uiNumberMask])
    .directive("datePicker", directive.datePicker)
    .directive("dateTime", directive.dateTime)
    .directive("validateForm", directive.validateForm)
    .directive("disabledForm", directive.disabledForm)
    .directive("scroll", directive.scroll)
    .directive("keypressEvents", ["$document", "$rootScope", directive.keypressEvents])
    .directive("refresher", directive.refresher)

    //contoller
    .controller("MainCtrl", ["$scope", "$http", "$state", "$rootScope", "$locale", "$timeout", "DTOptionsBuilder", controller.MainCtrl])
    .controller("LoginCtrl", ["$scope", "$http", "$rootScope", "$state", controller.LoginCtrl])
    .controller("TopBarCtrl", ["$scope", "$http", "$state", "$rootScope", "$stateParams", controller.TopBarCtrl])
    .controller("ClientInquiryCtrl", ["$scope", "$rootScope", "$http", "$state", "DTColumnBuilder", controller.ClientInquiryCtrl])
    .controller("StaffProfileCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", controller.StaffProfileCtrl])
    .controller("ResetPasswordCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", controller.ResetPasswordCtrl])
    .controller("ClientMasterCtrl", ["$scope", "$rootScope", "$http", "$location", "$window", "$stateParams", "toastr", controller.ClientMasterCtrl])
    .controller("EmployeeCtrl", ["$scope", "$http", "$timeout", "$stateParams", "$rootScope", "toastr", "DTColumnBuilder", "$compile", "$filter", controller.EmployeeCtrl])
    .controller("CreditorCtrl", ["$scope", "$http", "$location", "$stateParams", "$rootScope", "toastr", "DTColumnBuilder", "DTColumnDefBuilder", "$filter", "$state", controller.CreditorCtrl])
    .controller("CreditorImportCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", controller.CreditorImportCtrl])
    .controller("CreditorContactImportCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", controller.CreditorContactImportCtrl])
    .controller("VotingEventSetupCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", "DTOptionsBuilder", controller.VotingEventSetupCtrl])
    .controller("VotingReplyEntryCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", controller.VotingReplyEntryCtrl])
    .controller("VotingProjectionCtrl", ["$scope", "$http", "$stateParams", "$rootScope", "toastr", "DTOptionsBuilder", "DTColumnBuilder", "$compile", "$filter", controller.VotingProjectionCtrl])
    .controller("VotingProjectionResultCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", controller.VotingProjectionResultCtrl])
    .controller("VotingCreditorGenerationCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", "DTOptionsBuilder", "DTColumnBuilder", "$filter", controller.VotingCreditorGenerationCtrl])
    .controller("VotingAcknowledgementGenerationCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", "DTOptionsBuilder", "DTColumnBuilder", "$filter", controller.VotingAcknowledgementGenerationCtrl])
    .controller("LiveVotingFormGenerationCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", "DTOptionsBuilder", "DTColumnBuilder", "$filter", controller.LiveVotingFormGenerationCtrl])
    .controller("DocumentInquiryCtrl", ["$scope", "$http", "$timeout", "$interval", controller.DocumentInquiryCtrl])
    .controller("ClientInquiryCtrl", ["$scope", "$rootScope", "$http", "$state", "DTColumnBuilder", controller.ClientInquiryCtrl])
    .controller("CreditorInquiryCtrl", ["$scope", "$http", "$state", "DTColumnBuilder", "$stateParams", "$rootScope", "$compile", controller.CreditorInquiryCtrl])
    .controller("VotingFormGenerationCtrl", ["$scope", "$http", "$timeout", "$interval", controller.VotingFormGenerationCtrl])
    .controller("CreditorAmountReportCtrl", ["$scope", "$http", "$timeout", "$interval", controller.CreditorAmountReportCtrl])
    .controller("LiveVoteResultCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", controller.LiveVoteResultCtrl])
    .controller("LiveVotePageCtrl", ["$scope", "$rootScope", "$stateParams", "$http", "$state", "$timeout", controller.LiveVotePageCtrl])
    .controller("UnVoteListCtrl", ["$scope", "$rootScope", "$stateParams", "$http", "$state", "$timeout", "DTColumnBuilder", "$filter", controller.UnVoteListCtrl])
    .controller("AttendanceScanCtrl", ["$scope", "$rootScope", "$stateParams", "$http", "$state", "$timeout", controller.AttendanceScanCtrl])
    .controller("OnlineVotePageCtrl", ["$scope", "$rootScope", "$stateParams", "$http", "$state", controller.OnlineVotePageCtrl])
    .controller("CurrencyMasterCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", controller.CurrencyMasterCtrl])
    .controller("ComboValueMasterCtrl", ["$scope", "$http", "$timeout", "$interval", "toastr", controller.ComboValueMasterCtrl])
    .controller("GenerateOnlineVotingCtrl", ["$scope", "$http", "$timeout", "$interval", "$stateParams", "$rootScope", "toastr", controller.GenerateOnlineVotingCtrl])




    //application begin
    .run(["$transitions", "$rootScope", function ($transitions, $rootScope) {

        $rootScope.loginInfo = {};
        console.log("app start");
        console.log(angular.version);

        $transitions.onStart({ to: 'index.**' }, function (trans) {

            console.log("onStart");

            if (!$rootScope.loginInfo.UserID)
                return trans.router.stateService.target('login');

                var stateTo = trans.$to();
                let toParams = trans.params("to");

                if (toParams.ID) {
                    $rootScope.loginInfo.currentClientID = toParams.ID; 
                } else {
                    delete $rootScope.loginInfo.currentClientID
                    delete $rootScope.loginInfo.EventID
                }


            angular.element(document).ready(function () {
                $rootScope.getGeneralMasterList(); 

 
                if (toParams.ID) {
                    var stateNameArray = stateTo.name.split('.');
                    $("#link a").removeClass("active");
                    $("#link a[name='" + stateNameArray[1] + "']").addClass("active");
                }

            });




            // $rootScope.loginInfo.includeMaster = stateTo.includes["index.master"];
            // $rootScope.loginInfo.includeImport = stateTo.includes["index.import"];
            // $rootScope.loginInfo.includeInquiry = stateTo.includes["index.inquiry"];
            // $rootScope.loginInfo.includeReport = stateTo.includes["index.report"];
            // $rootScope.loginInfo.includeSystem = stateTo.includes["index.system"];

        });
    }])