import App from "../bundles/themes/main_theme";

// import StackedMenu from "stacked-menu/src/scripts/stacked-menu"
// import "stacked-menu/src/scripts/stacked-menu.jquery"
// import '!sass-loader!stacked-menu/src/scss/stacked-menu';
$(document).on('turbolinks:load', function(e) {
  App.init();
});

// $(document).ready(function() {
//   console.log( "ready!" );
// });

// App.init();