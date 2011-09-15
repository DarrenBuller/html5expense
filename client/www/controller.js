/*
 * Copyright 2011 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Roy Clarkson
 */

var reportId;

function onCreateReportSuccess(data, status) {
    reportId = $.trim(data);
    $.mobile.changePage($("#create-new-expenses"));
}

function onCreateReportError(data, status) {
    //TODO: handle error
}

$('#create-new-purpose').live('pagecreate', function(event){
    $("#create-new-next").click(function(){

        var formData = $("#create-new-purpose-form").serialize();

        $.ajax({
            type: "POST",
            url: "http://10.0.2.2:8080/api/reports/",
            cache: false,
            data: formData,
            success: onCreateReportSuccess,
            error: onCreateReportError
        });

        return false;
    });
});

$('#create-new-expenses').live('pagecreate', function(event){
    $("#create-new-expenses-next").click(function(){
        $.mobile.changePage($("#create-new-add-receipt"));
        return false;
    });
});

$('#create-new-expenses').live('pageshow', function(event, ui){
    
    // display loading spinner
    $.mobile.showPageLoadingMsg();

    // dynamically create the list of checkboxes
    $.getJSON("http://10.0.2.2:8080/api/reports/eligible-charges",
        function(data){
            var content = '<fieldset data-role="controlgroup">';
            $.each(data, function(i, charge){
                var id = 'checkbox-' + i;
                content += '<input type="checkbox" name="' + id + '" id="' + id + '" class="custom" />';
                content += '<label for="' + id + '">' + charge.date + ' - ' + charge.amount + ' - ' + charge.merchant + '</label>';
            });
            content += '</fieldset>';
            
            // set the content and trigger the create event to refresh and format the list properly 
            $('#charges-list').append(content).trigger('create');
            
            // hide loading spinner
            $.mobile.hidePageLoadingMsg();
    });
});

$('#review-status').live('pageshow', function(event, ui){

    // display loading spinner
    $.mobile.showPageLoadingMsg();

    // dynamically create the list of open reports
    $.getJSON("http://10.0.2.2:8080/api/reports",
        function(data){
            var content = '';
            $.each(data, function(i, expenseReport){
                if (expenseReport.purpose != null) {
                    content += '<li><a href="#create-new-confirm">' + expenseReport.purpose + '</a></li>';
                }
            });

            // set the new content and refresh the UI
            $('#reports-list').append(content).listview('refresh');
            
            // hide loading spinner
            $.mobile.hidePageLoadingMsg();
    });
});