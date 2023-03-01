var resultHighToLow = $('.session-list').sort(function (a, b) {
    var price1 = parseFloat($(a).data('sort'));
    var price2 = parseFloat($(b).data('sort'));
    return (price2 < price1) ? -1 : (price2 > price1) ? 1 : 0;

});

var resultLowToHigh = $('.session-list').sort(function (a, b) {
    var price1 = parseFloat($(a).data('sort'));
    var price2 = parseFloat($(b).data('sort'));
    return (price1 < price2) ? -1 : (price1 > price2) ? 1 : 0;

});

$(document).ready(function () {
    // changing sub Category on click on sub name
    $("#subCatName").click(function () {
        $("li.selectedMainCate button").click()
    })
    $(".disableSelection").click(function (e) {
        $("#dropdownMenuButton").text(ParentCategoryName) // fixing main Category Name
    })

     //session date filter
    //$("body").on("click", "#dateFilter", function (e) {
    //    collectFilters();
    //});

     //session duration filter
    //$("body").on("click", "#durationFilter", function (e) {
    //    collectFilters();
    //});

     //expert gender filter
    //$("body").on("click", "#genderFilter", function (e) {
    //    collectFilters();
    //});

     //session price filter
    //$("body").on("click", "#priceFilter", function (e) {
    //    collectFilters();
    //});

    // session state filter
    //$("body").on("click", "#stateFilter", function (e) {
    //    collectFilters();
    //});

    // expert name filter
    //$(".searchexpert .nameInput").on("keyup", function (e) {
    //    collectFilters();
    //});

    // sort by price low - high
    $(".sortby .sortByElements .pLowToHigh").on("click", function (e) {
        $(".sessionsList").html(resultLowToHigh);
    });

    // sort by price high - low
    $(".sortby .sortByElements .pHighToLow").on("click", function (e) {
        $(".sessionsList").html(resultHighToLow);
    });

});

//function collectFilters() {
//    var dateFilter;
//    var durationFilter;
//    var genderFilter;
//    var expertNameFilter;
//    var priceFilter;
//    var stateFilter;

//    var isDateInitFilter = false;
//    var isDurationInitFilter = false;
//    var isGenderInitFilter = false;
//    var isExNameInitFilter = false;
//    var isPriceInitFilter = false;
//    var isStateInitFilter = false;

//     //loop over date filters to get date value
//    $(".dateFilters #dateFilter").each(function (index, element) {
//        if ($(element).is(":checked")) {
//            dateFilter = $(element).val();
//        }

//    });

//     //loop over duration filters to get duration value
//    $(".durationFilters #durationFilter").each(function (index, element) {
//        if ($(element).is(":checked")) {
//            durationFilter = $(element).val();
//        }

//    });

//     //loop over gender filters to get gender value
//    $(".genderFilters #genderFilter").each(function (index, element) {
//        if ($(element).is(":checked")) {
//            genderFilter = $(element).val();
//        }

//    });

//     //loop over price filters to get session price value
//    $(".priceFilters #priceFilter").each(function (index, element) {
//        if ($(element).is(":checked")) {
//            priceFilter = $(element).val();
//        }

//    });

//     //loop over state filters to get duration value
//    $(".stateFilters #stateFilter").each(function (index, element) {
//        if ($(element).is(":checked")) {
//            stateFilter = $(element).val();
//        }

//    });

//     //get expert name value to filter with
//    expertNameFilter = $(".searchexpert .nameInput").val().toLowerCase();

//     //remove old filter attr
//    $(".session-list").each(function (index, element) {
//        $(element).removeAttr("data-isFiltered");
        
//    });

//     //check which criteria will init filter
//    if (dateFilter != null)
//        isDateInitFilter = true;

//    else if (durationFilter != null)
//        isDurationInitFilter = true;

//    else if (genderFilter != null)
//        isGenderInitFilter = true;

//    else if (priceFilter != null)
//        isPriceInitFilter = true;

//    else if (stateFilter != null)
//        isStateInitFilter = true;

//    else if (expertNameFilter != null)
//        isExNameInitFilter = true;

//    if (dateFilter != null)
//    {
//        // loop over appointments to filter with the given value
//        $(".session-date .sessionDay").each(function (index, element) {
//            var day = $(element).attr("data-day");

//            if (isDateInitFilter) {
//                if (day.toLowerCase() == dateFilter.toLowerCase() || dateFilter.toLowerCase() == "anytime" )
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false)
//                {

//                    if (day.toLowerCase() == dateFilter.toLowerCase() || dateFilter.toLowerCase() == "anytime")
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");

//                    else 
//                        $(element).parents(".session-list").removeAttr("data-isFiltered");
//                }
//            }
//        });

//    }

//    if (durationFilter != null)
//    {
//        //.session-price 
//        //loop over durations to filter with the given value
//        $(".session-list .sessionDuration").each(function (index, element) {
//            var duration = $(element).attr("data-duration");

//            if (isDurationInitFilter) {
//                if (duration.toLowerCase() == durationFilter.toLowerCase() || durationFilter.toLowerCase() == "all" )
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false) {

//                    if (duration.toLowerCase() == durationFilter.toLowerCase() || durationFilter.toLowerCase() == "all")
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");
//                    else {
//                        $(element).parents(".session-list").removeAttr("data-isFiltered");
//                    }
//                }

//            }

//        });

//    }

//    if (genderFilter != null) {
//        //loop over gender to filter with the given value
//        $(".img-avatar #gender").each(function (index, element) {
//            var expertGender = $(element).val();

//            if (isGenderInitFilter) {
//                if (expertGender.toLowerCase() == genderFilter.toLowerCase() || genderFilter.toLowerCase() == "all")
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false) {

//                    if (expertGender.toLowerCase() == genderFilter.toLowerCase() || genderFilter.toLowerCase() == "all")
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");
//                    else {
//                        $(element).parents(".session-list").removeAttr("data-isFiltered");
//                    }
//                }

//            }

//        });


//    }

//    if (stateFilter != null) {
//        //.expert-state 
//        //loop over states to filter with the given value
//        $(".session-list #state").each(function (index, element) {
//            var currentState = $(element).attr("data-state");
//            if (isStateInitFilter) {
//                if (currentState.toLowerCase() == stateFilter.toLowerCase() || stateFilter.toLowerCase() == "all")
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false) {

//                    if (currentState.toLowerCase() == stateFilter.toLowerCase() || stateFilter.toLowerCase() == "all")
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");
//                    else {
//                        $(element).parents(".session-list").removeAttr("data-isFiltered");
//                    }
//                }

//            }

//        });

//    }

//    if (priceFilter != null) {
//        //loop over session prices to filter with the given value
//        $(".session-list .sessionPrice").each(function (index, element) {
//            var price = parseFloat($(element).attr("data-price"));

//            if (isPriceInitFilter) {
//                if (priceFilter.toLowerCase() == 'lessthan150')
//                {
//                    if (price < 150)
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");

//                }

//                if (priceFilter.toLowerCase() == '150to300') {
//                    if ((price >= 150 && price <= 300))
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");

//                }

//                if (priceFilter.toLowerCase() == 'all') {
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//                }

                
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false) {

//                    if (priceFilter.toLowerCase() == 'lessthan150') {
//                        if (price < 150)
//                            $(element).parents(".session-list").attr("data-isFiltered", "true");
//                        else
//                            $(element).parents(".session-list").removeAttr("data-isFiltered");


//                    }

//                    else if (priceFilter.toLowerCase() == '150to300') {
//                        if ((price >= 150 && price <= 300))
//                            $(element).parents(".session-list").attr("data-isFiltered", "true");
//                        else
//                            $(element).parents(".session-list").removeAttr("data-isFiltered");

//                    }
//                    //else if (priceFilter.toLowerCase() == 'all') 
//                    //{
//                    //    $(element).parents(".session-list").removeAttr("data-isFiltered");
//                    //}
//                }

//            }

//        });


//    }

//    if (expertNameFilter != null)
//    {
//        $(".data-instractor .fullName").each(function (index, element) {
//            var expertName = $(element).text().toLowerCase();

//            if (isExNameInitFilter) {
//                if (expertName.toLowerCase().indexOf(expertNameFilter) > -1 /*|| genderFilter.toLowerCase() == "all"*/)
//                    $(element).parents(".session-list").attr("data-isFiltered", "true");
//            }

//            else {
//                var filterAttr = $(element).parents(".session-list").attr("data-isFiltered");
//                if (typeof filterAttr !== 'undefined' && filterAttr !== false) {

//                    if (expertName.toLowerCase().indexOf(expertNameFilter) > -1 /*|| genderFilter.toLowerCase() == "all"*/)
//                        $(element).parents(".session-list").attr("data-isFiltered", "true");
//                    else {
//                        $(element).parents(".session-list").removeAttr("data-isFiltered");
//                    }
//                }

//            }

//        });
        
//    }

//     //hide session list with no filter
//    $(".session-list").each(function (index, element) {

//        var attr = $(element).attr('data-isFiltered');

//        if (typeof attr === 'undefined' || attr === false) {
//            $(element).css({ "display": "none" });
//            //$(element).remove();

//        }
//        else
//            $(element).css({ "display": "block" });


//    });


//}

