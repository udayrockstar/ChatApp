$(function() {
    $(".chat").click(function(Ele) {
        $('#qnimate').addClass('popup-box-on');
        $("#titleName").html($(this).attr('data-value'));
        // console.log($(this).attr('data-value'));
    });

    $("#removeClass").click(function() {
        $('#qnimate').removeClass('popup-box-on');
    });
})
