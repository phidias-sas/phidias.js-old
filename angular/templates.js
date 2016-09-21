angular.module("phidias-angular").run(["$templateCache", function($templateCache) {$templateCache.put("/components/elements/phi-event-editor/phi-event-editor.html","<div class=\"bootstrap\">\n    <div class=\"form-inline date-range\">\n        <div class=\"form-group\">\n            <input bs-datepicker autoclose=\"true\" type=\"text\" name=\"startDate\" ng-model=\"vm.event.startDate\" class=\"form-control\" size=\"10\" placeholder=\"fecha inicial\" ng-change=\"vm.sanitize()\" />\n            <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"startTime\" ng-model=\"vm.event.startDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" ng-show=\"!vm.event.allDay\" />\n        </div>\n        a\n        <div class=\"form-group\">\n            <input bs-datepicker autoclose=\"true\" type=\"text\" name=\"endDate\" ng-model=\"vm.event.endDate\" class=\"form-control\" size=\"10\" placeholder=\"fecha final\" data-min-date=\"{{vm.minDate}}\" ng-change=\"vm.sanitize()\" />\n            <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"endTime\" ng-model=\"vm.event.endDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" ng-show=\"!vm.event.allDay\" />\n        </div>\n    </div>\n    <div class=\"form-inline date-options\">\n        <div class=\"form-group\">\n            <input type=\"checkbox\" id=\"allDayChbox\" ng-model=\"vm.event.allDay\" />\n            <label for=\"allDayChbox\">Todo el dia</label>\n        </div>\n        <div class=\"form-group\">\n            <input type=\"checkbox\" id=\"repeatsChbox\" ng-checked=\"!!vm.event.repeat\" ng-click=\"vm.event.repeat = !!vm.event.repeat ? null : vm.defaultRepeat\" />\n            <label for=\"repeatsChbox\">Repetir ...</label>\n        </div>\n    </div>\n    <div class=\"repeat\" ng-if=\"!!vm.event.repeat\">\n        <phi-event-repeat ng-model=\"vm.event.repeat\"></phi-event-repeat>\n    </div>\n</div>");
$templateCache.put("/components/elements/phi-event-repeat/phi-event-repeat.html","<div>\n\n    <div class=\"every\">\n        <label>se repite</label>\n        <select ng-model=\"vm.repeat.every\">\n            <option value=\"day\">Cada día</option>\n            <option value=\"week\">Cada semana</option>\n            <option value=\"month\">Cada mes</option>\n            <option value=\"year\">Cada año</option>\n        </select>\n    </div>\n\n    <div ng-show=\"vm.repeat.every\" class=\"interval\">\n        <label>Repetir cada</label>\n        <select ng-model=\"vm.repeat.interval\">\n            <option value=\"1\">1</option>\n            <option value=\"2\">2</option>\n            <option value=\"3\">3</option>\n            <option value=\"4\">4</option>\n            <option value=\"5\">5</option>\n            <option value=\"6\">6</option>\n            <option value=\"7\">7</option>\n            <option value=\"8\">8</option>\n            <option value=\"9\">9</option>\n            <option value=\"10\">10</option>\n            <option value=\"11\">11</option>\n            <option value=\"12\">12</option>\n            <option value=\"13\">13</option>\n            <option value=\"14\">14</option>\n            <option value=\"15\">15</option>\n            <option value=\"16\">16</option>\n            <option value=\"17\">17</option>\n            <option value=\"18\">18</option>\n            <option value=\"19\">19</option>\n            <option value=\"20\">20</option>\n            <option value=\"21\">21</option>\n            <option value=\"22\">22</option>\n            <option value=\"23\">23</option>\n            <option value=\"24\">24</option>\n            <option value=\"25\">25</option>\n            <option value=\"26\">26</option>\n            <option value=\"27\">27</option>\n            <option value=\"28\">28</option>\n            <option value=\"29\">29</option>\n            <option value=\"30\">30</option>\n        </select>\n\n        <span ng-switch=\"vm.repeat.every\">\n            <span ng-switch-when=\"day\">días</span>\n            <span ng-switch-when=\"week\">semanas</span>\n            <span ng-switch-when=\"month\">meses</span>\n            <span ng-switch-when=\"year\">años</span>\n        </span>\n    </div>\n\n    <div ng-show=\"vm.repeat.every == \'week\'\" class=\"week\">\n        <label>Día</label>\n        <ul>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-mo\" ng-model=\"vm.checkedDays[1]\" ng-change=\"vm.toggleDay(1, vm.checkedDays[1])\" />\n                <label for=\"event-repeat-day-mo\">L</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-tu\" ng-model=\"vm.checkedDays[2]\" ng-change=\"vm.toggleDay(2, vm.checkedDays[2])\" />\n                <label for=\"event-repeat-day-tu\">M</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-we\" ng-model=\"vm.checkedDays[3]\" ng-change=\"vm.toggleDay(3, vm.checkedDays[3])\" />\n                <label for=\"event-repeat-day-we\">X</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-th\" ng-model=\"vm.checkedDays[4]\" ng-change=\"vm.toggleDay(4, vm.checkedDays[4])\" />\n                <label for=\"event-repeat-day-th\">J</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-fr\" ng-model=\"vm.checkedDays[5]\" ng-change=\"vm.toggleDay(5, vm.checkedDays[5])\" />\n                <label for=\"event-repeat-day-fr\">V</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-sa\" ng-model=\"vm.checkedDays[6]\" ng-change=\"vm.toggleDay(6, vm.checkedDays[6])\" />\n                <label for=\"event-repeat-day-sa\">S</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-su\" ng-model=\"vm.checkedDays[7]\" ng-change=\"vm.toggleDay(7, vm.checkedDays[7])\" />\n                <label for=\"event-repeat-day-su\">D</label>\n            </li>\n        </ul>\n    </div>\n\n    <div ng-show=\"vm.repeat.every == \'month\'\" class=\"month\">\n        <label>Repetir cada</label>\n        <ul>\n            <li>\n                <input id=\"event-repeat-month-day\" type=\"radio\" value=\"\" ng-model=\"vm.repeat.on\" />\n                <label for=\"event-repeat-month-day\">día del mes</label>\n            </li>\n            <li>\n                <input id=\"event-repeat-month-weekday\" type=\"radio\" value=\"weekday\" ng-model=\"vm.repeat.on\" />\n                <label for=\"event-repeat-month-weekday\">día de la semana</label>\n            </li>\n        </ul>\n    </div>\n\n    <p ng-show=\"vm.repeat.every\" class=\"summary\">\n        <span>Este evento se repetirá </span><span ng-bind=\"vm.getSummary()\"></span>\n    </p>\n\n</div>");
$templateCache.put("/components/elements/phi-notification-settings/phi-notification-settings.html","<!-- Manual list of transports -->\n<section border-box ng-repeat=\"transport in vm.transports\" ng-show=\"!!(vm.destinations|filter:{transport:transport.name}).length || (vm.allowEdit && transport.allowEdit)\" class=\"phi-notification-transport phi-notification-transport-{{transport.name}}\">\n\n    <h1 ng-bind=\"transport.label\"></h1>\n\n    <div ng-repeat=\"destination in vm.destinations | filter: {transport:transport.name}\" ng-class=\"{enabled: destination.isEnabled, disabled: !destination.isEnabled}\">\n\n        <phi-notification-setting>\n\n            <div class=\"face\" ng-click=\"destination.isExpanded = !destination.isExpanded\">\n                <h1 ng-bind=\"destination.destination || transport.defaultText || \'predeterminado\'\" phi-icon-left=\"{{destination.isExpanded ? \'fa-caret-down\' : \'fa-caret-right\'}}\"></h1>\n            </div>\n\n            <div class=\"toggler\">\n                <input id=\"toggle_{{destination.id}}\" type=\"checkbox\" class=\"tgl tgl-ios\" ng-model=\"destination.isEnabled\"  ng-change=\"vm.save(destination)\" />\n                <label for=\"toggle_{{destination.id}}\" class=\"tgl-btn\"></label>\n            </div>\n\n            <div class=\"schedule\" phi-icon=\"fa-clock-o\">\n                <select ng-model=\"destination.schedule\" ng-change=\"vm.save(destination)\" ng-options=\"hour.value as hour.label for hour in vm.scheduleHours\">\n                    <option value=\"\">inmediato</option>\n                </select>\n            </div>\n\n            <button ng-if=\"transport.allowEdit && !!destination.destination\" class=\"menu\" phi-icon=\"fa-trash-o\" ng-click=\"vm.remove(destination)\"></button>\n            <button ng-if=\"!(transport.allowEdit && !!destination.destination)\" class=\"menu\"></button> <!-- placeholder -->\n\n        </phi-notification-setting>\n\n        <div class=\"subpreferences\" phi-visible=\"{{!!destination.isExpanded}}\" phi-visible-animation=\"scale\">\n\n            <phi-notification-setting ng-repeat=\"(key, preference) in destination.preferences\">\n                <div class=\"face\">\n                    <h1 ng-bind=\"preference.type\"></h1>\n                </div>\n                <div class=\"toggler\">\n                    <input id=\"toggle_pref_{{key}}\" type=\"checkbox\" class=\"tgl tgl-ios\" ng-model=\"preference.isEnabled\"  ng-change=\"vm.save(destination)\" />\n                    <label for=\"toggle_pref_{{key}}\" class=\"tgl-btn\"></label>\n                </div>\n                <div class=\"schedule\" phi-icon=\"fa-clock-o\">\n                    <select ng-model=\"preference.schedule\" ng-change=\"vm.save(destination)\" ng-options=\"hour.value as hour.label for hour in vm.scheduleHours\">\n                        <option value=\"\">{{destination.schedule ? \'consolidado\' : \'inmediato\'}}</option>\n                    </select>\n                </div>\n            </phi-notification-setting>\n\n        </div>\n\n    </div>\n\n    <div phi-visible=\"{{transport.isAdding}}\" phi-visible-animation=\"scale\" ng-init=\"transport.new = {transport: transport.name, isEnabled:true, destination: null, schedule: null}\">\n        <phi-notification-setting>\n\n            <div class=\"face\" style=\"display:flex\">\n                <button phi-icon=\"fa-times\" ng-click=\"transport.isAdding = false\"></button>\n                <phi-input ng-model=\"transport.new.destination\"></phi-input>\n            </div>\n\n            <div class=\"toggler\">\n                <input id=\"new_{{transport.name}}\" type=\"checkbox\" class=\"tgl tgl-ios\" ng-model=\"transport.isAdding\"/>\n                <label for=\"new_{{transport.name}}\" class=\"tgl-btn\"></label>\n            </div>\n\n            <div class=\"schedule\" phi-icon=\"fa-clock-o\">\n                <select ng-model=\"transport.new.schedule\" ng-change=\"vm.save(destination)\" ng-options=\"hour.value as hour.label for hour in vm.scheduleHours\">\n                    <option value=\"\">{{destination.schedule ? \'consolidado\' : \'inmediato\'}}</option>\n                </select>\n            </div>\n\n            <button class=\"menu\" ng-click=\"vm.save(transport.new); transport.isAdding = false; transport.new = {transport: transport.name, isEnabled:true, destination: null, schedule: null}\" phi-icon=\"fa-check\"></button>\n\n        </phi-notification-setting>\n    </div>\n\n    <phi-notification-setting class=\"adder\" ng-if=\"vm.allowEdit && transport.allowEdit\" ng-click=\"transport.isAdding = true\" phi-visible=\"{{!transport.isAdding}}\" phi-visible-animation=\"scale\">\n        <div class=\"face\">\n            <h1 phi-icon-left=\"fa-plus\">agregar destinatario</h1>\n        </div>\n    </phi-notification-setting>\n\n</section>");
$templateCache.put("/components/elements/phi-post/phi-post.html","<phi-post-header>\r\n    <phi-post-icon>\r\n        <iron-image ng-src=\"{{vm.post.author.avatar}}\" sizing=\"cover\"></iron-image>\r\n    </phi-post-icon>\r\n    <phi-post-preview>\r\n        <phi-post-author ng-bind=\"vm.post.author.firstName + \' \' + vm.post.author.lastName\"></phi-post-author>\r\n        <phi-post-date ng-bind=\"vm.post.publishDate\"></phi-post-date>\r\n    </phi-post-preview>\r\n</phi-post-header>\r\n<phi-post-body>\r\n    <!--<phi-post-description ng-bind-html=\"vm.post.description\"></phi-post-description>-->\r\n    <phi-post-blocks>\r\n        <phi-block\r\n            ng-repeat=\"block in vm.post.blocks\"\r\n            ng-model=\"block\">\r\n        </phi-block>\r\n    </phi-post-blocks>\r\n</phi-post-body>");
$templateCache.put("/components/elements/phi-post-editor/phi-post-editor.html","<div>\n\n    <div sv-root sv-part=\"vm.post.blocks\" sv-on-sort=\"vm.reorder()\">\n\n        <div ng-repeat=\"(key, block) in vm.post.blocks\" ng-init=\"block.ctrl = {}\" class=\"phi-post-editor-block\" sv-element>\n\n            <div class=\"phi-post-editor-block-toolbar\">\n\n                <div class=\"phi-post-editor-block-toolbar-handle\" sv-handle></div>\n\n                <div ng-if=\"block.ctrl.menu\" class=\"phi-post-editor-block-toolbar-menu\">\n\n                    <phi-button\n                        id=\"menu_toggler_{{block.id}}_{{key}}\"\n                        class=\"cancel\"\n                        ng-blur=\"block.menuShown = false\"\n                        ng-show=\"block.ctrl.currentState == \'default\'\"\n                        ng-click=\"block.menuShown = !block.menuShown\"\n                        phi-icon=\"fa-ellipsis-v\">\n                    </phi-button>\n\n                    <phi-button\n                        class=\"cancel\"\n                        ng-blur=\"block.menuShown = false\"\n                        ng-show=\"block.ctrl.currentState != \'default\'\"\n                        ng-click=\"block.ctrl.go(\'default\')\"\n                        phi-icon=\"fa-arrow-left\">\n                    </phi-button>\n\n                    <div\n                        phi-tooltip-for=\"menu_toggler_{{block.id}}_{{key}}\"\n                        phi-tooltip-origin=\"top right\"\n                        phi-tooltip-align=\"bottom right\"\n                        phi-visible=\"{{!!block.menuShown}}\"\n                        phi-visible-animation=\"slide-bottom\">\n\n                        <phi-menu phi-texture=\"paper\">\n                            <phi-menu-item ng-repeat=\"action in block.ctrl.menu\" ng-click=\"block.menuShown = false; block.ctrl.go(action.state)\" phi-icon-left=\"{{action.icon}}\">\n                                {{action.label}}\n                            </phi-menu-item>\n                            <!--<phi-menu-item ng-repeat=\"item in block.ctrl.states\" ng-click=\"block.menuShown = false; block.ctrl.go(item)\">\n                                <phi-icon icon=\"{{item.icon}}\"></phi-icon>\n                                {{item}}\n                            </phi-menu-item>-->\n                        </phi-menu>\n                    </div>\n                </div>\n\n            </div>\n\n            <phi-block\n                ng-model=\"block\"\n                controller-assign=\"block.ctrl\"\n                on-change=\"vm.attachBlock(block)\"\n                on-destroy=\"vm.removeBlock(block)\"\n            >\n            </phi-block>\n\n        </div>\n\n    </div>\n\n\n    <div>\n        <div phi-visible=\"{{!!adderIsOpen}}\" phi-visible-animation=\"scale\">\n            <phi-list-item ng-repeat=\"insertable in vm.insertable\" ng-click=\"$parent.adderIsOpen = false; vm.addBlock(insertable);\" phi-icon-left=\"{{insertable.icon}}\">\n                <span ng-bind=\"insertable.title\"></span>\n            </phi-list-item>\n        </div>\n\n        <phi-list-item ng-click=\"adderIsOpen = !adderIsOpen\" phi-icon-left=\"{{adderIsOpen ? \'fa-times\' : \'fa-plus\'}}\">\n            <span ng-bind=\"adderIsOpen ? \'cancelar\' : \'adjuntar\'\"></span>\n        </phi-list-item>        \n    </div>\n\n\n</div>");
$templateCache.put("/components/elements/phi-notification-settings/phi-notification-settings.orig/phi-notification-settings.html","<phi-setting ng-repeat=\"setting in vm.settings\" class=\"setting-transport transport-{{setting.transport}}\" ng-class=\"{open: setting.isOpen, closed: !setting.isOpen, enabled: setting.isEnabled, disabled: !setting.isEnabled}\">\n\n    <phi-setting-header ng-click=\"setting.isOpen = !setting.isOpen\">\n        <phi-setting-icon></phi-setting-icon>\n        <phi-setting-contents>\n            <phi-setting-title ng-bind=\"vm.getTransportName(setting.transport)\"></phi-setting-title>\n            <phi-setting-notice ng-repeat=\"notice in vm.describeSetting(setting)\" ng-bind=\"notice\"></phi-setting-notice>\n        </phi-setting-contents>\n    </phi-setting-header>\n\n    <phi-setting-body>\n\n        <phi-checkbox ng-model=\"setting.isEnabled\">recibir notificaciones</phi-checkbox>\n\n        <phi-setting-schedule>\n            <phi-checkbox ng-model=\"setting.hasSchedule\" ng-change=\"vm.toggleScheduling(setting, setting.hasSchedule)\">consolidar en un envio diario</phi-checkbox>\n            <div phi-visible=\"{{!!setting.hasSchedule}}\" phi-visible-animation=\"scale\" class=\"bootstrap\">\n                <!--<uib-timepicker class=\"bootstrap\" ng-model=\"setting.scheduleDate\" minute-step=\"10\" ng-change=\"setting.schedule = vm.toHour(setting.scheduleDate)\"></uib-timepicker>-->\n                <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"endTime\" ng-model=\"setting.scheduleDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" />\n            </div>\n        </phi-setting-schedule>\n\n        <phi-drawer ng-class=\"{open: setting.drawerIsOpen, closed: !setting.drawerIsOpen}\">\n\n            <phi-drawer-title ng-click=\"setting.drawerIsOpen = !setting.drawerIsOpen\">filtrar por tipo</phi-drawer-title>\n\n            <phi-drawer-body>\n                <phi-setting ng-repeat=\"typeSetting in setting.types\" ng-class=\"{open: typeSetting.isOpen, closed: !typeSetting.isOpen, enabled: typeSetting.isEnabled, disabled: !typeSetting.isEnabled}\">\n                    <phi-setting-header ng-click=\"typeSetting.isOpen = !typeSetting.isOpen\">\n                        <phi-setting-icon>{{type.icon}}</phi-setting-icon>\n                        <phi-setting-contents>\n                            <phi-setting-title ng-bind=\"typeSetting.type\"></phi-setting-title>\n                            <phi-setting-notice ng-repeat=\"notice in vm.describeSetting(typeSetting)\" ng-bind=\"notice\"></phi-setting-notice>\n                        </phi-setting-contents>\n                    </phi-setting-header>\n                    <phi-setting-body>\n                        <phi-checkbox ng-model=\"typeSetting.isEnabled\">recibir notificaciones</phi-checkbox>\n                        <phi-setting-schedule>\n                            <phi-checkbox ng-model=\"typeSetting.hasSchedule\" ng-change=\"vm.toggleScheduling(typeSetting, typeSetting.hasSchedule)\">consolidar en un envio diario</phi-checkbox>\n                            <div phi-visible=\"{{!!typeSetting.hasSchedule}}\" phi-visible-animation=\"scale\" class=\"bootstrap\">\n                                <!--<uib-timepicker class=\"bootstrap\" ng-model=\"typeSetting.scheduleDate\" minute-step=\"10\" ng-change=\"typeSetting.schedule = vm.toHour(typeSetting.scheduleDate)\"></uib-timepicker>-->\n                                <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"endTime\" ng-model=\"typeSetting.scheduleDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" />\n                            </div>\n                        </phi-setting-schedule>\n                    </phi-setting-body>\n                </phi-setting>\n            </phi-drawer-body>\n\n        </phi-drawer>\n\n    </phi-setting-body>\n</phi-setting>\n\n<phi-button ng-click=\"vm.save()\">Guardar</phi-button>");}]);