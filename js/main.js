$(document).ready(function(){

    function MappedImage(title, link, date){
        this.Title = title;
        this.Link = link;
        this.Date = date;
    }

    $('#toggleFloat').on('click', function(){

        if($('#imageResults > div').hasClass('col')){
            $( "#toggleFloat" ).text("Flex");
            $('.col').toggleClass('float_class col');
            $('.img_container').toggleClass("float_img_container img_container");  
            $('#imageResults').removeAttr('class');

        }else if($('#imageResults > div').hasClass('float_class')){
            $( "#toggleFloat" ).text("Float");
            $('.float_class').toggleClass('col float_class');
            $('.float_img_container').toggleClass('img_container float_img_container'); 
            $('#imageResults').addClass("row_images");

        };
    });

    function escapeHtml(text) {
        var map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }; 
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    $("#tag").keydown(function(event) {
        if(event.which === 13) {
            $('#search').click();
        }
    });

    $('#search').on('click', function(){
         
        event.preventDefault();
        var searchTag = $('#tag').val();
        searchTag = escapeHtml(searchTag);
        console.log(searchTag);

        if(!searchTag.match(/[a-öA-Ö0-9-!@#$^_:,.]/)){
            alert("Invalid characters");

        }else if(searchTag.match(/[a-öA-Ö0-9-!@#$^_:,.]/)){   

            $.ajax({
                url: 'http://www.flickr.com/services/feeds/photos_public.gne?tags=' + searchTag + '&format=json&jsoncallback=?',
                type:"GET",
                dataType: 'jsonp',
                crossDomain : true,

                success: function(result){

                    //$(".modal_content ").empty();
                    $("#imageResults").empty();
                    $("#tag").blur(); 

                    imageArray = $.map(result.items, function(item, index){

                        return index = new MappedImage(item.title, item.media.m, item.date_taken);
                    });
        
                $.each(imageArray, function(index, element){

                        var flexOrFloat = "";
                        var buttonValue = $('#toggleFloat').text();

                        if(buttonValue === "Float"){
                            flexOrFloat = 'col';
                        }else if(buttonValue === "Flex"){
                            flexOrFloat = 'float_class';
                        }

                        $('<div>').addClass(flexOrFloat).attr('id', index).appendTo("#imageResults");
                        $('<div>').addClass("img_container").appendTo('#' + index);
                        $('<img>').attr("src", element.Link).appendTo('#' + index + '>.img_container');
                        //$('<p>').text(element.Date).appendTo('.' + index);

                        $("#" + index).on('click', function() {

                            
                            $("#dialog").empty();
                            console.log($(this).attr("id"));
                            $( "#dialog" ).dialog({
                                title: element.Title
                        }).dialog( "open" );
                            $('body').addClass('no_scroll');
                            $('<div>').addClass("modal_content").appendTo("#dialog");
                            $('<img>').attr("src", element.Link).appendTo('.modal_content');
                            //funktion för att stänga
                            console.log($('#dialog').width());
                            console.log(typeof($('#dialog').width()));
                            $("div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.modal.ui-resizable").attr('style', '').css('width', $('#dialog').outerWidth() + 'px').css('margin-left', '-'+ $('#dialog').outerWidth()/2 +'px');


                            $(".ui-widget-overlay").on('click', function() {
                                $( "#dialog" ).dialog( "close" );
                            });
                        });
                    });
                },
                error: function(){
                    $('<p>').text("Oops! It seems like something went wrong, please try again later.").appendTo("#imageResults");
                }
            });  
        }    
    });

    $( "#dialog" ).dialog({ 
        autoOpen: false,
        draggable: false,
        modal: true,
        create: function() {
            $(this).css("maxHeight", 400);        
        },
        position: {
            my: "center",
            at: "center"
          },
        dialogClass: "modal",
        close: function(){
            $('body').removeAttr('class');
        }
    });
});