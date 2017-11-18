/**
 * Created by stephenmunabo on 11/17/17.
 */

$('#url-form').hide();
$('#error').hide();

//Some Configurations
var errorNoUrlEntered = 'Please provide a url';
var errorInvalidUrl = 'Please provide a valid url';

$(function () {

    var result = JSON.parse(localStorage.getItem("website"));
    $.each(result, function (i, item) {

        var id = item.url.replace('.', '');

        var bgUrl = 'data:image/jpeg;base64,' + item.screen_shoot;
        $('#sites').append(
            '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3"><div class="box"><a href="http://' + item.url + '" target="_blank" ><div class="box-header">' + item.url + '</div></a><div id="' + id + '" class="image-holder"><div id="del-' + id + '" class="delete-btns"><img class="closer" src="https://www.lillytrialguide.com/oncology/icons/oc_share_close.png" alt=""></div></div></div></div>'
        );
        $('#' + id).css("background-image", "url('" + bgUrl + "')");
    });


    //Prevent Default form Behavior
    $("form").submit(function (e) {
        return false;
    });


    var trackClicks = 0;


    //If user click on the body, close the form
    $("#content-area").mouseenter(function () {
        if (trackClicks == 1) {
            $('#url-form').hide(100);
            $('.adder-btn').show(100);
            $('#error').hide();
            return false;
        }
    });


    //Close the url field
    $('#close').on('click', function () {
        $('#url-form').hide(100);
        $('.adder-btn').show(100);
        $('#error').hide();
        return false;
    });


    //When the Add button is clicked, perform the following Actions
    //Hide the add button
    //Add 1 to the click tracker
    $('.adder-btn').on('click', function () {



        //Hide the add button and show the url input form
        $('.adder-btn').hide(100);
        $('#url-form').show(300);


        //Add 1 to the add button counter to indicate that the user is currently seeing the button
        trackClicks = 1;


        //When the user clicks on the go button to submit the url
        $('#go').on('click', function () {


            //Store the user url entry
            var url = $('#url').val();


            //checking if the user entered a value
            if (!url) {

                $('#url-form').show(100);
                $('#error').show(100).text(errorNoUrlEntered);
                return false;

            }
            else {
                if (isValidURL(url) == true) {

                    $('#error').hide();
                    if (getSiteData(url) == true) {

                        //alert('we got the url '+ url);
                        $('#url-form').hide(100);
                        $('.adder-btn').show(100);
                    }
                    else {
                        //alert('we where unable to get the url '+ url);
                    }
                }
                else {
                    //alert('not a valid url');
                    $('#error').show(100);
                }
            }

        })
    });


    function getSiteData(url) {

    // add the first student
    // Notice how the student is now an object and not an array containing an object.
        $('#loader').show();

        $.ajax({
            url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=http://' + url + '&screenshot=true',
            context: this,
            type: 'GET',
            dataType: 'json',
            timeout: 60000,
            success: function (result) {
                var imgData = result.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
                //$("img").attr('src', 'data:image/jpeg;base64,' + imgData);


                if (localStorage.getItem("website") === null) {

                    var newWebsite = [];

                    if (imgData !== null) {
                        newWebsite = [{
                            "id": guid(),
                            "url": url,
                            "created_at": $.now(),
                            "screen_shoot": imgData
                        }];
                    }
                    localStorage.setItem("website", JSON.stringify(newWebsite));
                } else {
                    // Retrieve the object from storage to add a new student

                    stored = {};
                    if (imgData !== null) {
                        newWebsite2 = {
                            "id": guid(),
                            "url": url,
                            "created_at": $.now(),
                            "screen_shoot": imgData
                        };
                    }
                    var retrievedObject = localStorage.getItem("website");
                    stored = JSON.parse(retrievedObject);
                    stored.push(newWebsite2);
                    localStorage.setItem("website", JSON.stringify(stored));
                }
                $('#loader').hide();
                location.reload();
                result = localStorage.getItem("website");
            },
            error: function (e) {
                $('#loader').hide();
                $('#url-form').show(100);
                $('.adder-btn').hide(100);
                $('#error').show();
            }


        });


        return true;


    }


    function isValidURL(str) {


        var prefix_secured = 'https://';
        var prefix_none_secured = 'http://';

        str = prefix_none_secured + str;


        //confirm('Please confirm that this is the url want to add '+ str);

        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (!regex.test(str)) {
            return false;
        } else {
            return true;
        }
    }

    function showLoader() {

    }


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    function getScreenShot(url) {

        var imgData;

        $.ajax({
            url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + url + '&screenshot=true',
            context: this,
            type: 'GET',
            dataType: 'json',
            timeout: 60000,
            success: function (result) {
                this.imgData = result.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
                //$("img").attr('src', 'data:image/jpeg;base64,' + imgData);
            },
            error: function (e) {
                //$("#msg").html("Error to fetch image preview. Please enter full url (eg: http://www.iamrohit.in)");
            }


        });


        return this.imgData;


    }


    function theData(data) {
        return data;
    }


});