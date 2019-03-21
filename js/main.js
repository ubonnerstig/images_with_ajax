$(document).ready(function(){

    function MappedImage(title, link, date){
        this.Title = title;
        this.Link = link;
        this.Date = date;
    }

    //Targeta hela wrapen fast med ett id o sen ändra baserat påde

    $('#toggleFloat').on('click', function(){
        if($('div').hasClass('col')){
            $( "#toggleFloat" ).text("Flex");
            $('.col').toggleClass('float_class col');
            $('.img_container').toggleClass("float_img_container img_container");  
            $('#imageResults').removeAttr('class');

        }else if($('div').hasClass('float_class')){
            $( "#toggleFloat" ).text("Float");
            $('.float_class').toggleClass('col float_class');
            $('.float_img_container').toggleClass('img_container float_img_container'); 
            $('#imageResults').addClass("row_images");

        };
    });

    $("#tag").keydown(function(event) {
        if(event.which === 13) {
            $('#search').click();
        }
    });

    $('#search').on('click', function(){

        var searchTag = $('#tag').val();
        event.preventDefault();

        $.ajax({
            url: 'http://www.flickr.com/services/feeds/photos_public.gne?tags=' + searchTag + '&format=json&jsoncallback=?',
            type:"GET",
            dataType: 'jsonp',
            crossDomain : true,

            success: function(result){

                $(".modal_content ").empty();
                $("#tag").blur(); 

                imageArray = $.map(result.items, function(item, index){

                    return index = new MappedImage(item.title, item.media.m, item.date_taken);
                });
    
               $.each(imageArray, function(index, element){

                    $('<div>').addClass("col").attr('id', index).appendTo("#imageResults");
                    $('<div>').addClass("img_container").appendTo('#' + index);
                    $('<img>').attr("src", element.Link).appendTo('#' + index + '>.img_container');
                    //$('<p>').text(element.Date).appendTo('.' + index);

                    $("#" + index).on('click', function() {
                        $("#dialog").empty();
                        console.log($(this).attr("id"));
                        $( "#dialog" ).dialog({
                            title: element.Title
                       }).dialog( "open" );
                        $('<div>').addClass("modal_content").appendTo("#dialog");
                        $('<img>').attr("src", element.Link).appendTo('.modal_content');
                        //funktion för att stänga


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
    });


    //sök på månad
//ta bort modal
    //inputvalidation
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
    });

});