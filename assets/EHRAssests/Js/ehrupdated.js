
/********************************  add medications********************************************* */
$(".add_input").click(function() {
    var $toAdd = $("input[name=checkListItem]").val();
    $(".list").append('<div class="item"><div class="item-close">' + $toAdd + '</div></div>');
    });
    //instead of using .click to remove use document on click.
        //click is the event, .item is the selector
        $(document).on('click', '.item', function() {
        $(this).remove();

});


/******************************** upload files********************************************* */
//create and add the file list and the hidden input list
var fileList = $('<ul class="file-list"></ul>');
var hiddenInputs = $('<div class="hidden-inputs hidden"></div>');
$(".file-uploader__message-area").after(fileList);
$(".file-list").after(hiddenInputs);

//when choosing a file, add the name to the list and copy the file input into the hidden inputs
$(".file-chooser__input").on("change", function () {

    $("#EHRFilesDtoLab").text("");
    $("#EHRFilesDtoMed").text("");

    $("div.loader").show();
    var formData = new FormData();
    formData.append("IsMed", true);
    formData.append("ClientId", $("#cId").val());

    var files = document.querySelector(".file-chooser__input").files;
    for (var i = 0; i < files.length; i++)
        formData.append("EHRFilesDto", files[i]);

    //------------------------------------------------------//
    if (files.length != 0)
    {
        $.ajax({
            url: "/ehr/savefile/",
            type: "POST",
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.isSuccess == true) {
                    bootbox.alert(data.mes);
                    for (var i = 0; i < files.length; i++) {

                        var file = files[i];
                        var fileName = file.name;

                        $(".file-list").append(
                            "<li id='medFile' style='display:none;'><span data-id = " + data.ids[i] + " class=file-list__name>" + fileName + "</span><button id='removeButtonMed' class='removal-button'></button><div class='vieweye' ><i class='fa fa-eye'></i></div></li>"
                        );

                        $('.vieweye').on('click', function () {
                            var CId = $("#cId").val();
                            var FName = $(this).parent().children("span").text().trim();
                            $.ajax({
                                type: 'GET',
                                url: '/ehr/GetFile?FileName=' + FName,
                                success: function (data) {
                                    $("#imgModalMed").attr('src', 'data:image/png;base64,' + data);
                                },
                                error: function () {
                                    alert('error');
                                },
                            });
                            //$("#imgModalMed").attr("src", "/../ClientsEHRs/MedicationFiles/" + CId + "/" + FName);
                            $('#myModal').modal('show');
                        });

                        $(".file-list").find("li:last").show(800);


                    }

                    // remove list of files 
                    const dt = new DataTransfer();
                    $('.file-chooser__input')[0].files = dt.files;

                }
                else if (data.isSuccess == false)
                    bootbox.alert(data.mes);

                // render dictionary errors
                else {
                    const dt = new DataTransfer();
                    $('.file-chooser__input')[0].files = dt.files;
                            
                    var dict = {
                                Age : "يرجى إدخال العمر",
                                Weight: "يرجى إدخال الوزن",
                                Height: "يرجى إدخال الطول",
                                Gender: "يرجى إدخال النوع",
                                EHRFilesDto: "خطأ فى صيغة الملف ...برجاء رفع صورة",
                            };
            
                    for (var prop in data) 
                    {
                        var dir = $("html").attr("dir");
                        if(dir == "rtl")
                        {
                            $("#" + prop + "Med").text(dict[prop]);
                            $("#" + prop + "Med").css({ "color": "red" });          
                        }
                        else
                        {
                            $("#" + prop + "Med").text(data[prop]);
                            $("#" + prop + "Med").css({ "color": "red" });
                        }

                    }
                    $("#meds").select2();
                    $("#active_sub").css({ "display": "block" });
                }

            },
            complete: function (data) {
                $("div.loader").hide();
            }


        });

    }

    

});

////removal button handler
$(".removal-button").on("click", function (e) {

    e.preventDefault();
    //update file list in file uploader
    const dt = new DataTransfer();
    var filename = $(this).parent().children().first().text();
    var files = $('.file-chooser__input')[0].files;
    for (var i = 0; i < files.length; i++) {
        if (files[i].name != filename) {
            dt.items.add(files[i]);
        }
    }

    $('.file-chooser__input')[0].files = dt.files;

    //remove the corresponding hidden input
    $(
        '.hidden-inputs input[data-uploadid="' +
        $(this).data("uploadid") +
        '"]'
    ).remove();

    //remove the name from file-list that corresponds to the button clicked
    $(this)
        .parent()
        .hide("puff")
        .delay(10)
        .queue(function () {
            $(this).remove();
        });

    //if the list is now empty, change the text back
    if ($(".file-list li").length === 0) {
        $(".file-uploader__message-area").text(
            options.MessageAreaText || settings.MessageAreaText
        );
    }
});

//removal button handler
//$("#removeButton").on("click", function (e) {
//    e.preventDefault();
//    //update file list in file uploader
//    const dt = new DataTransfer();
//    var filename = $(this).parent().children().first().text();
//    console.log("fn", filename);
//    var files = $('.file-chooser__input')[0].files;
//    for (var i = 0; i < files.length; i++) {
//        if (files[i].name != filename) {
//            dt.items.add(files[i]);
//        }
//    }

//    $('.file-chooser__input')[0].files = dt.files;

//    //remove the corresponding hidden input
//    $(
//        '.hidden-inputs input[data-uploadid="' +
//        $(this).data("uploadid") +
//        '"]'
//    ).remove();

//    //remove the name from file-list that corresponds to the button clicked
//    $(this)
//        .parent()
//        .hide("puff")
//        .delay(10)
//        .queue(function () {
//            $(this).remove();
//        });

//    //if the list is now empty, change the text back
//    if ($(".file-list li").length === 0) {
//        $(".file-uploader__message-area").text(
//            options.MessageAreaText || settings.MessageAreaText
//        );
//    }
//});



//(function ($) {
//    $.fn.uploader = function (options) {
//        var settings = $.extend(
//            {
//                MessageAreaText: "No files selected.",
//                MessageAreaTextWithFiles: "File List:",
//                DefaultErrorMessage: "Unable to open this file.",
//                BadTypeErrorMessage: "We cannot accept this file type at this time.",
//                acceptedFileTypes: [
//                    "pdf",
//                    "jpg",
//                    "gif",
//                    "jpeg",
//                    "bmp",
//                    "tif",
//                    "tiff",
//                    "png",
//                    "xps",
//                    "doc",
//                    "docx",
//                    "fax",
//                    "wmp",
//                    "ico",
//                    "txt",
//                    "cs",
//                    "rtf",
//                    "xls",
//                    "xlsx"
//                ]
//            },
//            options
//        );

//        var uploadId = 1;
//        //update the messaging
//        $(".file-uploader__message-area p").text(
//            options.MessageAreaText || settings.MessageAreaText
//        );

//        //create and add the file list and the hidden input list
//        var fileList = $('<ul class="file-list"></ul>');
//        var hiddenInputs = $('<div class="hidden-inputs hidden"></div>');
//        $(".file-uploader__message-area").after(fileList);
//        $(".file-list").after(hiddenInputs);

//        //when choosing a file, add the name to the list and copy the file input into the hidden inputs
//        $(".file-chooser__input").on("change", function () {
//            var files = document.querySelector(".file-chooser__input").files;

//            for (var i = 0; i < files.length; i++) {
//                console.log(files[i]);

//                var file = files[i];
//                var fileName = file.name.match(/([^\\\/]+)$/)[0];

//                //clear any error condition
//                $(".file-chooser").removeClass("error");
//                $(".error-message").remove();

//                //validate the file
//                var check = checkFile(fileName);
//                if (check === "valid") {
//                    // move the 'real' one to hidden list
//                    $(".hidden-inputs").append($(".file-chooser__input"));

//                    //insert a clone after the hiddens (copy the event handlers too)
//                    $(".file-chooser").append(
//                        $(".file-chooser__input").clone({ withDataAndEvents: true })
//                    );

//                    //add the name and a remove button to the file-list
//                    //$(".file-list").append(
//                    //  '<li style="display: none;"><span class="file-list__name">' +
//                    //    fileName +
//                    //    '</span><button class="removal-button" data-uploadid="' +
//                    //    uploadId +
//                    //    '"></button></li>'
//                    //);

//                    //<div class="vieweye" ><i class="fa fa-eye"></i></div>
//                    $(".file-list").append(
//                        '<li style="display: none;"><span class="file-list__name">' + fileName + '</span><button class="removal-button" data-uploadid="' + uploadId + '"></button></li>'
//                    );

//                    $('.vieweye').on('click', function () {
//                        $('#myModal').modal('show');
//                    });

//                    $(".file-list").find("li:last").show(800);

//                    //removal button handler
//                    $(".removal-button").on("click", function (e) {
//                        e.preventDefault();
//                        //update file list in file uploader
//                        const dt = new DataTransfer();
//                        var filename = $(this).parent().children().first().text();
//                        console.log("fn", filename);
//                        var files = $('.file-chooser__input')[0].files;
//                        for (var i = 0; i < files.length; i++) {
//                            if (files[i].name != filename) {
//                                dt.items.add(files[i]);
//                            }
//                        }

//                        $('.file-chooser__input')[0].files = dt.files;

//                        //remove the corresponding hidden input
//                        $(
//                            '.hidden-inputs input[data-uploadid="' +
//                            $(this).data("uploadid") +
//                            '"]'
//                        ).remove();

//                        //remove the name from file-list that corresponds to the button clicked
//                        $(this)
//                            .parent()
//                            .hide("puff")
//                            .delay(10)
//                            .queue(function () {
//                                $(this).remove();
//                            });

//                        //if the list is now empty, change the text back
//                        if ($(".file-list li").length === 0) {
//                            $(".file-uploader__message-area").text(
//                                options.MessageAreaText || settings.MessageAreaText
//                            );
//                        }
//                    });


//                    //removal button handler
//                    $("#removeButton").on("click", function (e) {
//                        console.log("remove");
//                        e.preventDefault();
//                        //update file list in file uploader
//                        const dt = new DataTransfer();
//                        var filename = $(this).parent().children().first().text();
//                        console.log("fn", filename);
//                        var files = $('.file-chooser__input')[0].files;
//                        for (var i = 0; i < files.length; i++) {
//                            if (files[i].name != filename) {
//                                dt.items.add(files[i]);
//                            }
//                        }

//                        $('.file-chooser__input')[0].files = dt.files;

//                        //remove the corresponding hidden input
//                        $(
//                            '.hidden-inputs input[data-uploadid="' +
//                            $(this).data("uploadid") +
//                            '"]'
//                        ).remove();

//                        //remove the name from file-list that corresponds to the button clicked
//                        $(this)
//                            .parent()
//                            .hide("puff")
//                            .delay(10)
//                            .queue(function () {
//                                $(this).remove();
//                            });

//                        //if the list is now empty, change the text back
//                        if ($(".file-list li").length === 0) {
//                            $(".file-uploader__message-area").text(
//                                options.MessageAreaText || settings.MessageAreaText
//                            );
//                        }
//                    });


//                    //so the event handler works on the new "real" one
//                    $(".hidden-inputs .file-chooser__input")
//                        .removeClass("file-chooser__input")
//                        .attr("data-uploadId", uploadId);

//                    //update the message area
//                    $(".file-uploader__message-area").text(
//                        options.MessageAreaTextWithFiles ||
//                        settings.MessageAreaTextWithFiles
//                    );

//                    uploadId++;
//                } else {
//                    //indicate that the file is not ok
//                    $(".file-chooser").addClass("error");
//                    var errorText =
//                        options.DefaultErrorMessage || settings.DefaultErrorMessage;

//                    if (check === "badFileName") {
//                        errorText =
//                            options.BadTypeErrorMessage || settings.BadTypeErrorMessage;
//                    }

//                    $(".file-chooser__input").after(
//                        '<p class="error-message">' + errorText + "</p>"
//                    );
//                }
//            }
//        });

//        var checkFile = function (fileName) {
//            var accepted = "invalid",
//                acceptedFileTypes =
//                    this.acceptedFileTypes || settings.acceptedFileTypes,
//                regex;

//            for (var i = 0; i < acceptedFileTypes.length; i++) {
//                regex = new RegExp("\\." + acceptedFileTypes[i] + "$", "i");

//                if (regex.test(fileName)) {
//                    accepted = "valid";
//                    break;
//                } else {
//                    accepted = "badFileName";
//                }
//            }

//            return accepted;
//        };
//    };
//})($);
  
  //init
  //$(document).ready(function () {
  //  $(".fileUploader").uploader({
  //    MessageAreaText: "Upload your medications"
  //  });
  //});
  
/*****************************************second upload************************************ */
$(document).ready(function() {

    function checkFile(file) {
        return file == null;
    }

    // ------------  File upload BEGIN ------------
    $('.file__input--file').on('change', function (event) {

        $("#EHRFilesDtoLab").text("");
        $("#EHRFilesDtoMed").text("");

        $("div.loader").show();
        var formData = new FormData();
        formData.append("IsMed", false);
        formData.append("ClientId", $("#cId").val());

        var files = event.target.files;
        for (var i = 0; i < files.length; i++)
            formData.append("EHRFilesDto", files[i]);


        //------------------------------------------------------//
        if (files.length != 0) {
            $.ajax({
                url: "/ehr/savefile/",
                type: "POST",
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    if (data.isSuccess == true) {
                        bootbox.alert(data.mes);
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            $("<div class='file__value in-left'><div data-id = " + data.ids[i] + " class='file-list__name2'>" + file.name + "</div><div id='removeButtonDis' class='removal-button2' data-id='" + file.name + "' ></div><div class='vieweye2' ><i class='fa fa-eye'></i></div></div> ").insertBefore('#file__input');
                            $('.file-uploader__message-area2').remove();
                            $('.vieweye2').on('click', function () {
                                var CId = $("#cId").val();
                                var FName = $(this).parent().children(".file-list__name2").text().trim();
                                $.ajax({
                                    type: 'GET',
                                    url: '/ehr/GetFile?FileName=' + FName,
                                    success: function (data) {
                                        $("#imgModalLab").attr('src', 'data:image/png;base64,' + data);
                                    },
                                    error: function () {
                                        alert('error');
                                    },
                                });
                                //$("#imgModalLab").attr("src", "/../ClientsEHRs/LabFiles/" + CId + "/" + FName);
                                $('#myModal2').modal('show');
                            });


                        }
                        // remove list of files 
                        const dt = new DataTransfer();
                        $('.file__input--file')[0].files = dt.files;
                    }
                    else if (data.isSuccess == false)
                        bootbox.alert(data.mes);

                    // render dictionary errors
                    else {

                            var dict = {
                                Age : "يرجى إدخال العمر",
                                Weight: "يرجى إدخال الوزن",
                                Height: "يرجى إدخال الطول",
                                Gender: "يرجى إدخال النوع",
                                EHRFilesDto: "خطأ فى صيغة الملف ...برجاء رفع صورة",
                            };
            
                        const dt = new DataTransfer();
                        $('.file__input--file')[0].files = dt.files;

                        for (var prop in data) {
                            var dir = $("html").attr("dir");
                            if(dir == "rtl")
                            {
                                $("#" + prop + "Lab").text(dict[prop]);
                                $("#" + prop + "Lab").css({ "color": "red" });          
                            }
                            else
                            {
                                $("#" + prop + "Lab").text(data[prop]);
                                $("#" + prop + "Lab").css({ "color": "red" });
                            }
                                
                            }
                        $("#meds").select2();
                        $("#active_sub").css({ "display": "block" });
                    }

                },
                complete: function () {
                    $("div.loader").hide();
                }


            });

        }

        //for (var i = 0; i < files.length; i++) {
        //    var file = files[i];
        //    //$("<div class='file__value in-left'><div class='file-list__name2'>" + file.name + "</div><div class='removal-button2' data-id='" + file.name + "' ></div></div>").insertBefore('#file__input');
        //    //$('.file-uploader__message-area2').remove(); 
        //    /*<div class='vieweye2' ><i class='fa fa-eye'></i></div>*/

        //    $("<div class='file__value in-left'><div class='file-list__name2'>" + file.name + "</div><div id = 'removeLabFile' class='removal-button2' data-id='" + file.name + "' ></div></div> ").insertBefore('#file__input');
        //    $('.file-uploader__message-area2').remove();
        //    $('.vieweye2').on('click', function () {
        //        $('#myModal2').modal('show');
        //    });

            
        //    //$('.removal-button2').on('click', function () {
        //    //    $('.file__value').remove();
        //    //    const dt = new DataTransfer();
        //    //    var filename = $(this).children().first().text();
        //    //    var files = $('.file__input--file')[0].files;

        //    //    for (var i = 0; i < files.length; i++) {
        //    //        if (files[i].name != filename) {
        //    //            dt.items.add(files[i]);
        //    //        }
        //    //    }
        //    //    $('.file__input--file')[0].files = dt.files;

        //    //});

        //}

    });

    // /*'.file__value'*/
    //Click to remove item
    $('body').on('click', '#removeLabFile', function () {
        $(this).parent().remove();

        const dt = new DataTransfer();
        var filename = $(this).parent().children(".file-list__name2").text();
        var files = $('.file__input--file')[0].files;

        for (var i = 0; i < files.length; i++) {
            if (files[i].name != filename) {
                dt.items.add(files[i]);
            }
        }
        $('.file__input--file')[0].files = dt.files;


    });

    // ------------ File upload END ------------ 
    
    
    
});
/*****************************************checklist******************************************** */
    // assign function to onclick property of checkbox
//document.getElementById('active').onclick = function () {
//    // call toggleSub when checkbox clicked
//    // toggleSub args: checkbox clicked on (this), id of element to show/hide
//    toggleSub(this, 'active_sub');
//};

// called onclick of checkbox
function toggleSub(box, id) {
    // get reference to related content to display/hide
    var el = document.getElementById(id);

    if (box.checked) {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
        $(".list2").children().remove();
    }
}


(function ($) {
    var CheckboxDropdown = function (el) {
        var _this = this;
        this.isOpen = false;
        this.areAllChecked = false;
        this.$el = $(el);
        this.$label = this.$el.find('.dropdown-label');
        this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
        this.$inputs = this.$el.find('[type="checkbox"]');

        this.onCheckBox();

        this.$label.on('click', function (e) {
            e.preventDefault();
            _this.toggleOpen();
        });

        this.$checkAll.on('click', function (e) {
            e.preventDefault();
            _this.onCheckAll();
        });

        this.$inputs.on('change', function (e) {
            _this.onCheckBox();
        });
    };

    CheckboxDropdown.prototype.onCheckBox = function () {
        this.updateStatus();
    };

    CheckboxDropdown.prototype.updateStatus = function () {
        var checked = this.$el.find(':checked');

        this.areAllChecked = false;
        this.$checkAll.html('Check All');

        if (checked.length <= 0) {
            this.$label.html('Select Options');
        }
        else if (checked.length === 1) {
            this.$label.html(checked.parent('label').text());
        }
        else if (checked.length === this.$inputs.length) {
            this.$label.html('All Selected');
            this.areAllChecked = true;
            this.$checkAll.html('Uncheck All');
        }
        else {
            this.$label.html(checked.length + ' Selected');
        }
    };

    CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
        if (!this.areAllChecked || checkAll) {
            this.areAllChecked = true;
            this.$checkAll.html('Uncheck All');
            this.$inputs.prop('checked', true);
        }
        else {
            this.areAllChecked = false;
            this.$checkAll.html('Check All');
            this.$inputs.prop('checked', false);
        }

        this.updateStatus();
    };

    CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
        var _this = this;

        if (!this.isOpen || forceOpen) {
            this.isOpen = true;
            this.$el.addClass('on');
            $(document).on('click', function (e) {
                if (!$(e.target).closest('[data-control]').length) {
                    _this.toggleOpen();
                }
            });
        }
        else {
            this.isOpen = false;
            this.$el.removeClass('on');
            $(document).off('click');
        }
    };

    var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
    for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
        new CheckboxDropdown(checkboxesDropdowns[i]);
    }
})(jQuery);



    //    document.getElementById('IsChronic').onclick = function() {
    //    // call toggleSub when checkbox clicked
    //    // toggleSub args: checkbox clicked on (this), id of element to show/hide
    //    toggleSub(this, 'active_sub');
    //};
    
    //// called onclick of checkbox
    //function toggleSub(box, id) {
    //    // get reference to related content to display/hide
    //    var el = document.getElementById(id);
        
    //    if ( box.checked ) {
    //        el.style.display = 'block';
    //    } else {
    //        el.style.display = 'none';
    //    }
    //}
    
    
    //(function($) {
    //  var CheckboxDropdown = function(el) {
    //    var _this = this;
    //    this.isOpen = false;
    //    this.areAllChecked = false;
    //    this.$el = $(el);
    //    this.$label = this.$el.find('.dropdown-label');
    //    this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
    //    this.$inputs = this.$el.find('[type="checkbox"]');
        
    //    this.onCheckBox();
        
    //    this.$label.on('click', function(e) {
    //      e.preventDefault();
    //      _this.toggleOpen();
    //    });
        
    //    this.$checkAll.on('click', function(e) {
    //      e.preventDefault();
    //      _this.onCheckAll();
    //    });
        
    //    this.$inputs.on('change', function(e) {
    //      _this.onCheckBox();
    //    });
    //  };
      
    //  CheckboxDropdown.prototype.onCheckBox = function() {
    //    this.updateStatus();
    //  };
      
    //  CheckboxDropdown.prototype.updateStatus = function() {
    //    var checked = this.$el.find(':checked');
        
    //    this.areAllChecked = false;
    //    this.$checkAll.html('Check All');
        
    //    if(checked.length <= 0) {
    //      this.$label.html('Select Options');
    //    }
    //    else if(checked.length === 1) {
    //      this.$label.html(checked.parent('label').text());
    //    }
    //    else if(checked.length === this.$inputs.length) {
    //      this.$label.html('All Selected');
    //      this.areAllChecked = true;
    //      this.$checkAll.html('Uncheck All');
    //    }
    //    else {
    //      this.$label.html(checked.length + ' Selected');
    //    }
    //  };
      
    //  CheckboxDropdown.prototype.onCheckAll = function(checkAll) {
    //    if(!this.areAllChecked || checkAll) {
    //      this.areAllChecked = true;
    //      this.$checkAll.html('Uncheck All');
    //      this.$inputs.prop('checked', true);
    //    }
    //    else {
    //      this.areAllChecked = false;
    //      this.$checkAll.html('Check All');
    //      this.$inputs.prop('checked', false);
    //    }
        
    //    this.updateStatus();
    //  };
      
    //  CheckboxDropdown.prototype.toggleOpen = function(forceOpen) {
    //    var _this = this;
        
    //    if(!this.isOpen || forceOpen) {
    //       this.isOpen = true;
    //       this.$el.addClass('on');
    //      $(document).on('click', function(e) {
    //        if(!$(e.target).closest('[data-control]').length) {
    //         _this.toggleOpen();
    //        }
    //      });
    //    }
    //    else {
    //      this.isOpen = false;
    //      this.$el.removeClass('on');
    //      $(document).off('click');
    //    }
    //  };
      
    //  var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
    //  for(var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
    //    new CheckboxDropdown(checkboxesDropdowns[i]);
    //  }
    //})(jQuery);

    /**********************************************BMI Calculate********************************************** */
    $(function() {
        $("#calculateBtn").click(function () {

            $(".btn-secondary").each(function (index, element) {
                $(element).css({
                    "background-color": "#f8f8f8", 
                });

                $(element).children().first().css({
                    "opacity": ''
                });

            });

            $("#showBmiNumber").text('');
            var lang = $("#detectLang").val();


            if (calculateBmi() == undefined)
                return;

            //show bmi number in html tag

            if (lang == "ar") 
                $("#showBmiNumber").html(calculateBmi() + " كجم/م" + "<sup>2</sup>");

            else
                $("#showBmiNumber").html(calculateBmi() + " kg/m" + "<sup>2</sup>");

            try {
                let bmi, height, weight, m2;
                height = $("#heightInp").val();
                weight = $("#weightInp").val();
                // Convert cm to m
                m2 = height / 100;
                // calculate bmi
                bmi = weight / (m2 * m2);
                var bmiResult = "Healthy";
                if (bmi < 18.5) {
                    bmiResult = "Underweight";
                } else if (bmi >= 18.5 && bmi < 25) {
                    bmiResult = "Healthy";
                }
                else if (bmi >= 25.0 && bmi < 29.9) {
                    bmiResult = "Overweight";
                } else {
                    bmiResult = "obese";
                }
                var calculator = {
                    "Height": height,
                    "Weight": weight,
                    "Gender": $("#bloodType option:selected").text(),
                    "Smoker": $("#isSmoker option:selected").text(),
                    "Blood Type": $("#genderInp option:selected").text(),
                    "Age": $("#age").val(),
                    "BMI Result": bmiResult
                };
                webengage.track("BMI Calculated", {
                    "Height": height,
                    "Weight": weight,
                    "Gender": $("#bloodType option:selected").text(),
                    "Smoker": $("#isSmoker option:selected").text(),
                    "Blood Type": $("#genderInp option:selected").text(),
                    "Age": $("#age").val(),
                    "BMI Result": bmiResult
                });
            } catch (e) {
                console.log(e);
            }

            // Below 18.5
            if (calculateBmi() < 18.5) {
                let $Underweight = $("#Underweight").addClass(
                    "bg-info text-white animated flash"
                );
                setTimeout(function() {
                    $Underweight.removeClass("bg-info text-white animated flash");
                }, 5000);
                $(".btn1").css("background-color","#F0D9DE");
                $('.underw_div,.underw_p').css({"opacity":"1",'color':'black'});
                $('#showBmiNumber').css("color","#efbac6");
                $(".btn2 , .btn3 , .btn4").css({ "background-color": "#f8f8f8", 'color': '#000 !important' });
                $("#underweight").modal('show'); 
            }
            // 18.5–24.9
            if (calculateBmi() >= 18.5 && calculateBmi() < 24.9) {
                let $Healthy = $("#Healthy").addClass(
                    "bg-success text-white animated shake"
                );
                setTimeout(function() {
                    $Healthy.removeClass("bg-success text-white animated shake");
                }, 5000);
                $(".btn2").css("background-color","#3fbca1");
                $('.normal_div,.normal_p').css({"opacity":"1",'color':'#000'});
                $('#showBmiNumber').css("color","#3fbca1");
                $(".btn1 , .btn3 , .btn4").css({"background-color":"#f8f8f8",'color':'#000 !important'});
    
            
            }

            // 25.0–29.9
            if (calculateBmi() >= 25.0 && calculateBmi() < 29.9) {
                let $Overweight = $("#Overweight").addClass(
                    "bg-warning text-white animated tada"
                );
                setTimeout(function() {
                    $Overweight.removeClass("bg-warning text-white animated tada ");
                }, 5000);
                $(".btn3").css("background-color","#FFCC00");
                $('.overw_div,.overw_p').css({"opacity":"1",'color':'#000'});
                $('#showBmiNumber').css("color","#FFCC00");
                $(".btn1 , .btn2 , .btn4").css({ "background-color": "#f8f8f8", 'color': '#000 !important' });
                $("#overweight").modal('show');

            }
            //30.0 and bigger
            if (calculateBmi() >= 30.0) {
                let $Obese = $("#Obese").addClass("bg-danger text-white animated heartBeat");
                setTimeout(function() {
                    $Obese.removeClass("bg-danger text-white animated heartBeat ");
                }, 5000);
                $(".btn4").css("background-color","#C75D6F");
                $('.obese_div,.obese_p').css({"opacity":"1",'color':'#000'});
                $('#showBmiNumber').css("color","#C75D6F");
                $(".btn1 , .btn2 , .btn3").css({ "background-color": "#f8f8f8", 'color': '#000 !important' });
                $("#obese").modal('show');

            }


        });

        function calculateBmi() {
            let bmi, height, weight, m2;
            height = $("#heightInp").val();
            weight = $("#weightInp").val();

            if ((height != null && height != undefined && height != '') &&
                (weight != null && weight != undefined && weight != '')) {

                // Convert cm to m
                m2 = height / 100;
                // calculate bmi
                bmi = weight / (m2 * m2);
                //return bmi with 3 decimal
                //example =>  return this number 31.14548 to 31.1
                


                return bmi.toPrecision(3);
            }
            
        }
    });


    
    $(".custom-select").each(function() {
        

        var classes = $(this).attr("class"),
            id = $(this).attr("id"),
            name = $(this).attr("name");

        var template = "";
        var dir = $("html").attr("dir");
        if(dir == "rtl")
        {
            template = '<div class="' + classes + '">';
            template +=
            '<span class="custom-select-trigger-rtl">' +
            $(this).attr("placeholder") +
            "</span>";
            template += '<div class="custom-options">';    

        }        
        else
        {
           template = '<div class="' + classes + '">';
            template +=
            '<span class="custom-select-trigger">' +
            $(this).attr("placeholder") +
            "</span>";
            template += '<div class="custom-options">';    

        }
    

        
        $(this)
            .find("option")
            .each(function() {
            template +=
                '<span class="custom-option ' +
                $(this).attr("class") +
                '" data-value="' +
                $(this).attr("value") +
                '">' +
                $(this).html() +
                "</span>";
            });
        template += "</div></div>";

        $(this).wrap('<div class="custom-select-wrapper"></div>');
        $(this).hide();
        $(this).after(template);
        });
        $(".custom-option:first-of-type").hover(
        function() {
            $(this)
            .parents(".custom-options")
            .addClass("option-hover");
        },
        function() {
            $(this)
            .parents(".custom-options")
            .removeClass("option-hover");
        }
        );

        var dir = $("html").attr("dir");
        if(dir == "rtl"){
            $(".custom-select-trigger-rtl").on("click", function() {
            $("html").one("click", function() {
                $(".custom-select").removeClass("opened");
            });
            $(this)
                .parents(".custom-select")
                .toggleClass("opened");
            event.stopPropagation();
            });
            $(".custom-option").on("click", function() {
            $(this)
                .parents(".custom-select-wrapper")
                .find("select")
                .val($(this).data("value"));
            $(this)
                .parents(".custom-options")
                .find(".custom-option")
                .removeClass("selection");
            $(this).addClass("selection");
            $(this)
                .parents(".custom-select")
                .removeClass("opened");
            $(this)
                .parents(".custom-select")
                .find(".custom-select-trigger-rtl")
                .text($(this).text());
            });

        }
        else
        {
        $(".custom-select-trigger").on("click", function() {
            $("html").one("click", function() {
                $(".custom-select").removeClass("opened");
            });
            $(this)
                .parents(".custom-select")
                .toggleClass("opened");
                 event.stopPropagation();
            });
            $(".custom-option").on("click", function() {
            $(this)
                .parents(".custom-select-wrapper")
                .find("select")
                .val($(this).data("value"));
            $(this)
                .parents(".custom-options")
                .find(".custom-option")
                .removeClass("selection");
            $(this).addClass("selection");
            $(this)
                .parents(".custom-select")
                .removeClass("opened");
            $(this)
                .parents(".custom-select")
                .find(".custom-select-trigger")
                .text($(this).text());
            });

        }        


        $(".custom-select2").each(function() {
        var classes = $(this).attr("class"),
            id = $(this).attr("id"),
            name = $(this).attr("name");
        var dir = $("html").attr("dir");

        var template = ""
        if(dir == "rtl")
        {
            template = '<div class="' + classes + '">';
            template +=
                '<span class="custom-select-trigger2-rtl">' +
                $(this).attr("placeholder") +
                "</span>";
            template += '<div class="custom-options2">';    
    
        }
        else
        {
            template = '<div class="' + classes + '">';
            template +=
                '<span class="custom-select-trigger2">' +
                $(this).attr("placeholder") +
                "</span>";
            template += '<div class="custom-options2">';    

        }

        
        $(this)
            .find("option")
            .each(function() {
            template +=
                '<span class="custom-option2 ' +
                $(this).attr("class") +
                '" data-value="' +
                $(this).attr("value") +
                '">' +
                $(this).html() +
                "</span>";
            });
        template += "</div></div>";

        $(this).wrap('<div class="custom-select-wrapper2"></div>');
        $(this).hide();
        $(this).after(template);
        });
        $(".custom-option2:first-of-type").hover(
        function() {
            $(this)
            .parents(".custom-options2")
            .addClass("option-hover");
        },
        function() {
            $(this)
            .parents(".custom-options2")
            .removeClass("option-hover");
        }
        );
    
        var dir = $("html").attr("dir");
        if(dir == "rtl")
        {
            $(".custom-select-trigger2-rtl").on("click", function() {
            $("html").one("click", function() {
                $(".custom-select2").removeClass("opened");
            });
            $(this)
                .parents(".custom-select2")
                .toggleClass("opened");
            event.stopPropagation();
            });
            $(".custom-option2").on("click", function() {
            $(this)
                .parents(".custom-select-wrapper2")
                .find("select")
                .val($(this).data("value"));
            $(this)
                .parents(".custom-options2")
                .find(".custom-option2")
                .removeClass("selection");
            $(this).addClass("selection");
            $(this)
                .parents(".custom-select2")
                .removeClass("opened");
            $(this)
                .parents(".custom-select2")
                .find(".custom-select-trigger2-rtl")
                .text($(this).text());
            });
            
        }        
        else
        {
            $(".custom-select-trigger2").on("click", function() {
            $("html").one("click", function() {
                $(".custom-select2").removeClass("opened");
            });
            $(this)
                .parents(".custom-select2")
                .toggleClass("opened");
            event.stopPropagation();
            });
            $(".custom-option2").on("click", function() {
            $(this)
                .parents(".custom-select-wrapper2")
                .find("select")
                .val($(this).data("value"));
            $(this)
                .parents(".custom-options2")
                .find(".custom-option2")
                .removeClass("selection");
            $(this).addClass("selection");
            $(this)
                .parents(".custom-select2")
                .removeClass("opened");
            $(this)
                .parents(".custom-select2")
                .find(".custom-select-trigger2")
                .text($(this).text());
            });

        }

        
/***************************************************************************** */
$(function()
    {
   
      //$('#username').change(function()
      //{
      //  if ($(this).is(':checked')) {
      //    $('.demo2').text("Your Health record 'll be shared with your treating doctor");
      //  }
      //  else{
      //    $('.demo2').text('Switch ON to share your Health record with the treating doctor');
      //  }
      //});
});
/*************************************chronic disease********************************************* */

$(function () {
    var select = $('#active_sub');
    select.on('change', function () {
        var $toAdd = $(this).children(':selected').text();
        var Id = $(this).children(':selected').val();
        if (Id != 0) {
            $(".list2").append('<div data-id = ' + Id + ' class = "disSelected"  id = "selected" style = "display:block" > <div id="remChronic" class="item-close2"></div>' + $toAdd + '</div > ');
        }
    });

    $(document).on('click', '#remChronic', function () {
        $(this).parent('#selected').remove();
        //e.preventDefault();
    });

});
