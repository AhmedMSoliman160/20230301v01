$(function () {
    // pressing on Logo should redirect to Esaal Home Page
    $("#imgLogo").click(function () {
        window.location.href = "/ar/home"
    })

    // Selecting Category (redirect to Expert Page)
    $(".Cate").click(function () {
        var CategoryIdParts = $(this).attr("data-attr-CatId").split('_')
        var MainCategoryId = CategoryIdParts[1]
        var SubCategoryId = CategoryIdParts[2]
        window.location.href = "/LPCategory_Expert?catId=" + MainCategoryId + "&scatId=" + SubCategoryId
    })

})