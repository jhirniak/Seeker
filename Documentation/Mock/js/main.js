/*

  This dynamically resizes form text input elements as the user types.
  It does it by creating a div with the input element's contents,
  fetching the size of that div, removing the div, and then setting
  the input element to that same size. If you can think of a less messy
  way to do this, let me know, but I think it's actually kind of elegant.

*/

$(function() {
    $("#accordion").accordion();
});

$(".optionBox > button#closeBtn").click(function() {
    $("#popup").hide();
});

$(".optionBox > button#selectBtn").click(function() {
    $("#popup").hide();
});

$(document).ready(function() {
    $('input[type=text]').each(function(index) {
        makeSensitive($(this));
    });

    // hide stageSelection items except first
    $("#stageSelection ul").hide();
    $("#stageSelection ul:first").show();
    $("#popup").hide();

    $("#in0").val("Section 1b, 3, 4, Last").addClass("inputted").width(150);
    $("#in1").val("Scottish-Gaelic").addClass("inputted").width(110);
    $("#in2").val("Welsh").addClass("inputted").width(47);
    $("#in3").val("1b, 3a, 4, Last").addClass("inputted").width(101);
    $("#in4").val("Catalan").addClass("inputted").width(58);
    $("#in5").val("French").addClass("inputted").width(52);
    $("#in6").val("4").addClass("inputted").width(11);
    $("#in7").val("All").addClass("inputted").width(21);

    addActionButtons($(document));

    // add leaves
    $(".node:not(:has(.node))").css({
        background: "url(img/leaf.png) 0 0 no-repeat",
        color: "#3c0388",
        "padding-left": "21px",
        "text-decoration": "none",
        display: "block",
        "background-size": "16px 16px"
    });
});

function makeSensitive(textField) {
    // get initial value
    var valueInit = textField.val();

    // resize function
    var inputResize = function(id, pad) {
        var valueCur = $(id).val();
        var valueId = valueCur.split(' ').join('_').replace(/[^a-zA-Z 0-9]+/g, '');
        $('p').after('<div class="fake_form" id="fake_form_' + valueId + '">' + valueCur + '</div>');
        var valueInitW = $('#fake_form_' + valueId).width() + 2 + pad;
        $('#fake_form_' + valueId).remove();
        $(id).css('width', valueInitW);
    }
    inputResize(textField, 0);

    // on focus
    textField.focus(function() {
        var valueCur =textField.val();
        if (valueCur == valueInit) {
            textField.val('');
        }
        if (textField.width() < 50) {
            textField.width(50);
        }
        textField.removeClass('inputted');
    });

    // on blur
    textField.blur(function() {
        var valueCur = textField.val();
        if (valueCur == '') {
            textField.val(valueInit);
        } else {
            textField.addClass('inputted');
        }
        inputResize(textField, 0);
    });

    // on keystroke
    textField.keydown(function() {
        inputResize(textField, 30);
    });
}

/*

  Insert section into DOM.

*/

function addObject(obj) {
    if (typeof(obj) == "undefined") {
        return;
    } else {
        var container = $("<div class=\"queryAtom\"></div>");
        container.append(obj);
        container.append(createRemoveButton());
        container.append("<span class=\"comma\">, </span>");
        $("#query").append(container);
    }
}

function addSection(options) {
    var select = document.createElement("select");
    options.split(",").forEach(function (item) {
        var option = document.createElement("option");
        option.value = option.textContent = item;
        select.appendChild(option);
    });
    addObject(select);
}

function addInputBox(defText) {
    if (typeof(defText) == "undefined") {
        return; // no empty allowed
    } else {
        var obj = $("<input type=\"text\">");
        obj.attr("value", defText);
        makeSensitive(obj);
        addObject(obj);
    }
}

function addText(text) {
    var obj = document.createTextNode(text);
    addObject(obj);
}

/* Mocks */
function addGroupExample() {
    addSection("Committee of Experts, Committee of Great Coffee, Regulatory Committee");
}

function addSectionExample() {
    addSection("1a, 1b, 1c, 2a, 2b, 3a, 3b, 3c, 3d, 4, 5, 6a, 6b");
}

function addInputBoxExample() {
    addInputBox("empty");
}

function addTextExample() {
    addText("Hello world!");
}

function createRemoveButton() {
    var btn = $("<button type=\"button\" class=\"removeBtn\" onclick=\"removeContainer()\">X</button>");
    btn.click(function () {
        $(this).parent().remove();
    });
    return btn;
}

// stage selection
$("#stageSelection").click(function() {

});

function makesteps(steps) {
    var current = 2;
    return function() {
        if (current <= steps) {
            $("#stageSelection ul:nth-of-type(" + current++ + ")").show();
        }
    };
}

var stepper = makesteps(3);

$("#stageSelection").click(function() {
    stepper();
});

$("#help, #undo, #redo").click(function() {
    alert("Not implemented.");
});

$("#newQuery, #changeQuery").click(function () {
    alert("Not implemented");
    window.location.href = "index.html";
});

$("#restartQuery").click(function() {
    $("#query ol.tree").remove();
});

$("#addGroup").click(function () {
    var content = $('<ol class="tree"> \
        <li> \
            <label for="folder1">Folder 1</label> <input type="checkbox" checked id="folder1" /> \
            <ol> \
                <li class="file"><a href="document.html.pdf">File 1</a></li> \
                <li class="file">F<input type="text" value="Select country" />F</li> \
                <li class="file"> \
                    <select> \
                        <option>Hungary</option> \
                        <option>Scotland</option> \
                    </select> \
                </li> \
                <li> \
                    <label for="subfolder1">Subfolder 1</label> <input type="checkbox" id="subfolder1" /> \
                    <ol> \
                        <li class="file"><a href="">Filey 1</a></li> \
                        <li><a href="">Coffee</a></li> \
                    </ol> \
                </li> \
            </ol> \
        </li> \
        <li> \
            <label for="cycle">Cycle</label> <input type="checkbox" checked id="cycle" /> \
            <ol> \
                <li class="file"><a href="">Committee of Experts</a></li> \
                <li class="file"><a href="">Final cycle</a></li> \
            </ol> \
        </li> \
    </ol>');

    //content.insertBefore("#addGroup");
    // set committee content
    var reportType = {
        "title": "Report Type",
        "inType": "checkbox",
        "outType": "report",
        "options": [ "State Periodical Report",
                     "Committee of Experts' evaluation report",
                     "Committee of Ministers' Recommendation"
                   ]
    };
    setStageFromJSON(reportType);
    $("#popup").show();
});

function setStageFromJSON(content) {
    // clear all out
    $("#stageSelection").empty();
    // c = JSON.parse(content);
    $(".optionBox > button#selectBtn").unbind("click"); // remove old event handler
    $(".optionBox > button#selectBtn").click(parseSelection(content["outType"])); // set callback function to be executed upon submitting the form
    $(".optionBox #title").text(content["title"]); // set title

    switch(content["inType"]) {

        case "stage":
            content["options"].forEach(function(group) {
                // set group
                $("#stageSelection").append("<ul></ul>");
                group.forEach(function (item) {
                    // add item
                    $("#stageSelection ul:last-child").append("<li>" + item + "</li>");
                });
            });
        break;

        case "checkbox":
            content["options"].forEach(function(item) {
                $("#stageSelection").append("<input type=\"checkbox\" name=\"selection\" value=\"" + item + "\" />" + item + "<br />");
            });
        break;

        case "message":
            $("#stageSelection").append("<p style=\"text-align:center; vertical-align:middle; margin: 0 auto;\">" + content["message"] + "</p>")
        break;

        default:

    }
}

function parseSelection(type) {
    switch(type) {

        case "report":
            return function () {
                var checked = [];
                $(".optionBox input:checkbox[name=\"selection\"]:checked").each(function() {
                    checked.push($(this).val());
                });

                var $content =
                $(" <ol class=\"tree\"> \
                   <li> \
                       <label for=\"folder1\">" +
                        checked.join(", ") +
                        "</label> <input type=\"checkbox\" checked id=\"folder1\" /> \
                   </li> \
                   <button type=\"button\" class=\"closeGroupBtn\" title=\"Close the current group (whole gray box)\">X</button> \
                </ol> ");

                addActionButtons($content);

                $content.insertBefore("#query #addGroup");
                $("#popup").hide();
            };
        break;

        case "checkbox":

        break;

        case "noAction":
            return function () {
                $("#popup").hide();
            }
        break;

        default:
    }
}

function addActionButtons($content) {
    $content.first
    var buttons = "<span class=\"opButtons\"> \
                       <button type=\"button\" value=\"Edit\" alt=\"Edit\" title=\"Edit this node\n(to edit you can click also anywhere on the node name)\" class=\"editBtn\">E</button> \
                       <button type=\"button\" value=\"Delete\" alt=\"Delete\" title=\"Delete this node from the query\" class=\"deleteBtn\">X</button> \
                   </span>";
    $content.find(".node").not(":has(.node)").append(buttons);
    $content.find(".node:has(.node) label").after(buttons);
    $content.find(".closeGroupBtn").click(function () {
        $(this).parent().remove();
    });
    $content.find('.editBtn').click(function () {
        var reportType = {
            inType: "message",
            outType: "noAction",
            title: "Not implemented",
            message: "Not implemented"
        };
        setStageFromJSON(reportType);
        $("#popup").show();
    });
    $content.find(".deleteBtn").click(function () {
        $(this).parent().parent().remove();
    });
}