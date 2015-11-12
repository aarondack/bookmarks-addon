var data = require('./utils.js');
$(document).ready(function () {
        AP.register({
          "dialog-button-click":saveClicked,
	 	  "ad-bookmarks-message.action.nonlink": textData 
        });

	  	function textData(message,form) {
				$("#namefield").val(message.body);
			}
			
		function saveClicked(event, closeDialog) {
			if (event.action == 'ad-bookmarks.save') {
				 bookmark = $("#namefield").val();
         		 label = $("#labelfield").val();
         		 data.push({bookmark: bookmark, label: label});
			}
			closeDialog(true);
		}
});
