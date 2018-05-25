import 'bootstrap-datetimepicker-npm/build/js/bootstrap-datetimepicker.min.js'

export const navigation = () => {
  return {
    template: require('./views/common/navigation.html'),
  }
};

export const topnavbar = () => {
  return {
    template: require('./views/common/topnavbar.html'),
  }
};

export const footer = () => {
  return {
    template: require('./views/common/footer.html'),
  }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
export function sideNavigation($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element) {
          // Call the metsiMenu plugin and plug it to sidebar navigation
          $timeout(function () {
              element.metisMenu();

          });

          //Colapse menu in mobile mode after click on element
          var menuElement = $('#side-menu a:not([href$="\\#"])');
          menuElement.click(function () {
              if ($(window).width() < 769) {
                  $("body").toggleClass("mini-navbar");
              }
          });

          // Enable initial fixed sidebar
          if ($("body").hasClass('fixed-sidebar')) {
              var sidebar = element.parent();
              sidebar.slimScroll({
                  height: '100%',
                  railOpacity: 0.9,
              });
          }
      }
  };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
export function minimalizaSidebar($timeout) {
  return {
      restrict: 'A',
      template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
      controller:["$scope", "$element", function ($scope, $element) {
          $scope.minimalize = function () {
              var top_button_panel = $("div.top-button-panel");
              $("body").toggleClass("mini-navbar");
              if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                  // Hide menu in order to smoothly turn on when maximize menu
                  $('#side-menu').hide();

                  // For smoothly turn on menu
                  setTimeout(
                      function () {
                          $('#side-menu').fadeIn(400);
                      }, 200);
              } else if ($('body').hasClass('fixed-sidebar')) {
                  $('#side-menu').hide();
                  setTimeout(
                      function () {
                          $('#side-menu').fadeIn(400);
                      }, 100);
              } else {
                  // Remove all inline style from jquery fadeIn function to reset menu state 
                  $('#side-menu').removeAttr('style');
              }
          }
      }]
  };
}

/**
 * icheck - Directive for custom checkbox icheck
 */
export function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function (newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}


export function fileread() {
    return {
        scope: {
            fileread: "=",
            fileext: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result.split("base64,")[1];
                        scope.fileext = changeEvent.target.files[0].name.substr(changeEvent.target.files[0].name.lastIndexOf('.'));
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}

export function uiNumberMask($filter) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            element.addClass('text-right');

            ngModelCtrl.$formatters.push(function (a) {
                return $filter('number')(ngModelCtrl.$modelValue, 2)
            });

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9|\.]/g, '');
                var res = clean.match(/\d+\.?\d{0,2}/g);

                if (res && res[0])
                    clean = res[0];

                ngModelCtrl.$setViewValue(clean);
                ngModelCtrl.$render();

                return clean;
            });

            element.on('blur', function (event) {
                element.val($filter('number')(ngModelCtrl.$modelValue, 2));
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

        }
    };
}

export function datePicker() {
    var format = "DD/MM/YYYY"
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                useCurrent: true
            });

            element.on('blur', function () {

                if (element.val()) {
                    //console.log("blur");
                    ngModelCtrl.$setViewValue(element.val() + " 00:00:00");
                }

            })

            scope.$watch(attrs.ngModel, function (v) {
                if (v && v.length >= 10)
                    element.val(v.substring(0, 10));

            });
        }
    };
}

export function dateTime() {
    var format = "DD/MM/YYYY HH:mm:ss";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                format: format,
                keepOpen: true,
                useCurrent: true
            })

            element.on('blur', function () {

                if (element.val()) {
                    ngModelCtrl.$setViewValue(element.val());
                }

            })

        }
    };
}

export function validateForm() {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                //console.log(elem.find('.ng-invalid:first'));
                elem.find('.ng-invalid:first').focus()

            });
        }
    };
}

export function disabledForm() {
    return {
        restrict: 'A',
        scope: {
            'disabledForm': '<'
        },
        link: function (scope, elem, attrs) {
            scope.$watch('disabledForm', function (value) {
                if (scope.disabledForm)
                    $(elem).find("input, textarea").prop('disabled', 'disabled');
            });
        }
    };
}

export function scroll() {
    return {
        link: function (scope, element, attrs) {
            element.bind("wheel", function () {
                //console.log('Scrolled below header.');

                var top = $(window).scrollTop();
                var height = $(document).innerHeight();
                var wHeight = $(window).height();
                if (top + wHeight > height - 150) {

                    if ($("#floatBottomButtonGroup").hasClass("floatBottomButtonGroup")) {
                        $("#floatBottomButtonGroup").removeClass("floatBottomButtonGroup");
                        //$("#floatBottomButtonGroup").css('padding-left', '0px');
                    }
                } else {

                    if (!$("#floatBottomButtonGroup").hasClass("floatBottomButtonGroup")) {
                        $("#floatBottomButtonGroup").addClass("floatBottomButtonGroup");
                        //$("#floatBottomButtonGroup").css('padding-left', '220px');
                    }
                }


            });
        }
    }
}

export function keypressEvents($document, $rootScope) {
    return {
        restrict: 'A',
        link: function () {

            if (!window.linked) {
                //console.log('linked');
                //console.log($document);

                $document.bind('keypress', function (e) {
                    $rootScope.$broadcast('keypress', e, String.fromCharCode(e.which));
                });
                window.linked = true;
            }
        }
    }
}

export function refresher (){
    return {
      transclude: true,
      controller: function($scope, $transclude,
                           $attrs, $element) {
        var childScope;
  
        $scope.$watch($attrs.condition, function(value) {

            console.log("refresher");

          $element.empty();
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
  
          $transclude(function(clone, newScope) {
            childScope = newScope;
            $element.append(clone);
          });
        });
      }
    };
  }

 