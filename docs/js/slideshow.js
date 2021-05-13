function resizeImageContainer() {
    $('.slideshow-img').each(function() {
        const imagesContainer = $(this);
        imagesContainer.find('img').first().each(function() {
            const image = $(this);
            const imgHeight = image.height();
            console.log("image height ", imgHeight)
            imagesContainer.height(imgHeight + 20);
        })
    });
}

$(window).on('load', function() {
 
    $(".slideshow-control").each(function() {
        $(this).on('click', 'span', function() {
            //this is the element clicked
            const slideContainer = $(this).parents('.slideshow-container')
            slideContainer.find("img").removeClass("opaque");

            
            const newImage = $(this).index();
            slideContainer.find(".slideshow-img img").eq(newImage).addClass("opaque");

            slideContainer.find(".slideshow-control span").removeClass("selected");
            $(this).addClass("selected");
        });
    });


    //set the height of the div containing the images to the height of the images it contains
    resizeImageContainer();

    $( window ).resize(function() {
        resizeImageContainer();
    });
});