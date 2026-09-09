$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});

// Pronunciation card for the CJK name in the page title
$(document).ready(function () {
  var $name = $("#cjk-name");
  if ($name.length === 0) {
    return;
  }
  $name.popover({
    container: "body",
    html: true,
    sanitize: false,
    trigger: "click",
    placement: "bottom",
    content: function () {
      return $("#cjk-name-card").html();
    },
    template: '<div class="popover name-popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
  });
  $name.on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $name.popover("toggle");
    }
  });
  var nameAudio = null;
  $(document).on("click", ".name-audio-btn", function () {
    if (nameAudio === null) {
      nameAudio = new Audio("/assets/audio/name-pronunciation.m4a");
    }
    nameAudio.currentTime = 0;
    nameAudio.play();
  });
  $(document).on("click", function (e) {
    if ($(e.target).closest("#cjk-name, .name-popover").length === 0) {
      $name.popover("hide");
    }
  });
});
