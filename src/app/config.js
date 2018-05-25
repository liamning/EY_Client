/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */

export default function config($stateProvider, $urlRouterProvider) {
     
    $urlRouterProvider.otherwise("/login");
    
    $stateProvider
    .state('index', {
        abstract: true,
        url: "/index",
        template: require("./views/common/content.html"),
    })
    .state('index.Creditor', {
        abstract: true,
        url: "/Creditor", 
    })
    .state('index_Online', {
        abstract: true,
        url: "/index_Online",
        template: require("./views/common/OnlineContent.html"),
    })
    .state('index.ComboValueSetting', {
        url: "/ComboValueSetting",
        template: require("./views/ComboValueMaster.html")
    })
    .state('index.CurrencySetting', {
        url: "/CurrencySetting",
        template: require("./views/CurrencyMaster.html")
    }) 
    .state('login', {
        url: "/login",
        template: require("./views/login.html"),
    }) 
    .state('index.Client', {
        url: "/Client/:ID",
        reloadOnSearch: false,
        template: require("./views/ClientMaster.html"),
    })
    .state('index.StaffProfile', {
        url: "/StaffProfile",
        template: require("./views/StaffProfile.html"),
    })
    .state('index.ResetPassword', {
        url: "/ResetPassword",
        template: require("./views/ResetPassword.html"),
    })

    .state('index.VotingEventSetup', {
        url: "/VotingEventSetup/:ID",
        template: require("./views/VotingEventSetup.html"), 
    })

    .state('index.Creditor.Creditors', {
        url: "/Creditors/:ID&:CreditorID",
        template: require("./views/Creditors.html"),
        reloadOnSearch: false,
    })
    .state('index.Creditor.CreditorInquiry', {
        url: "/CreditorInquiry/:ID",
        template: require("./views/CreditorInquiry.html"),
    })

    .state('index.CreditorImport', {
        url: "/CreditorImport/:ID",
        template: require("./views/CreditorImport.html"),
    })
    .state('index.CreditorContactImport', {
        url: "/CreditorContactImport/:ID",
        template: require("./views/CreditorContactImport.html"),
    })

    // .state('index.EmployeeImport', {
    //     url: "/EmployeeImport/:ID",
    //     template: require("./views/EmployeeImport.html"),
    // })

    .state('index.VotingReplyEntry', {
        url: "/VotingReplyEntry/:ID",
        template: require("./views/VotingReplyEntry.html"),
    })

    // .state('index.Employee', {
    //     url: "/Employee/:ID",
    //     template: require("./views/Employee.html"),
    // })

    .state('index_Online.OnlineVotePage', {
        url: "/OnlineVotePage/:id&:token",
        template: require("./views/OnlineVotePage.html"),
    })
    .state('index_Online.OnlineVoteSuccess', {
        url: "/OnlineVoteSuccess",
        template: require("./views/OnlineVoteSuccess.html"), 
    })
    .state('index.LiveVotePage', {
        url: "/LiveVotePage/:ID&:EventID",
        template: require("./views/LiveVotePage.html"),
    })
    .state('index.UnVoteList', {
        url: "/UnVoteList/:ID&:EventID",
        template: require("./views/UnVoteList.html"),
    })
    .state('index.LiveVoteAttendance', {
        url: "/LiveVoteAttendance/:ID&:EventID",
        template: require("./views/LiveVoteAttendance.html"),
    })
    .state('index_Online.LiveVoteResult', {
        url: "/LiveVoteResult/:ID&:EventID",
        template: require("./views/LiveVoteResult.html"),
    })

    .state('index.VotingProjection', {
        url: "/VotingProjection/:ID&:EventID",
        template: require("./views/VotingProjection.html"),
    }) 
    .state('index.VotingProjectionResult', {
        url: "/VotingProjectionResult/:ID&:EventID",
        template: require("./views/VotingProjectionResult.html"),
    })
    .state('index.AttendanceScan', {
        url: "/AttendanceScan",
        template: require("./views/AttendanceScan.html"),
    })
    .state('index.VotingCreditorGeneration', {
        url: "/VotingCreditorGeneration",
        template: require("./views/VotingCreditorGeneration.html"),
    })
    .state('index.EventAcknowledgementPath', {
        url: "/EventAcknowledgementPath",
        template: require("./views/EventAcknowledgementPath.html"),
    })
    .state('index.LiveVotingFormGeneration', {
        url: "/LiveVotingFormGeneration",
        template: require("./views/LiveVotingFormGeneration.html"),
    })
    // .state('index.CreditorAmountReport', {
    //     url: "/CreditorAmountReport",
    //     template: require("./views/CreditorAmountReport.html"),
    // })
       
    .state('index.DocumentInquiry', {
        url: "/DocumentInquiry",
        template: require("./views/DocumentInquiry.html"),
    })
    .state('index.ClientInquiry', {
        url: "/ClientInquiry",
        template: require("./views/ClientInquiry.html"),
    })
    .state('index.VotingFormGeneration', {
        url: "/VotingFormGeneration",
        template: require("./views/VotingFormGeneration.html")
    })
    // .state('index.GenerateOnlineVoting', {
    //     url: "/GenerateOnlineVoting/:ID",
    //     template: require("./views/GenerateOnlineVoting.html")
    // }) 
         
  }
  