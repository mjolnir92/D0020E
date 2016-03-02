(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sensor.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"expandbox sensor\" data-id=\"pulse\">\n  <div class=\"info\">\n    <div class=\"preview\">\n      <div class=\"icon\">\n        <div class=\""
    + alias4(((helper = (helper = helpers.sensorType || (depth0 != null ? depth0.sensorType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sensorType","hash":{},"data":data}) : helper)))
    + "\"></div>\n      </div>\n      <div class=\"data\">\n        <div class=\"main\" id=\"pulse\">\n          "
    + alias4(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\n        </div>\n        <span class=\"status\">Status: OK</span>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});
})();