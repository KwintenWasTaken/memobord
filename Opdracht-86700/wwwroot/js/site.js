const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;

// Globale variabelen
let slepen = false;

// Opdracht 1

$("#titelInvoer").on("input", titelInvoer);

$("#kleurTitel").on("input", kleurTitel);

$("#grootteTitel").on("input", grootteTitel);

$("#kleurAchtergrond").on("input", kleurAchtergrond);

function titelInvoer() {
    let tekst = $("#titelInvoer").val();
    $("#titel").html(tekst);
}

function kleurTitel() {
    let kleur = $("#kleurTitel").val();
    $("#titel").css("color", kleur)
}

function grootteTitel() {
    let grootte = $("#grootteTitel").val();
    $("#titel").css("font-size", grootte + "px");
}

function kleurAchtergrond() {
    let kleur = $("#kleurAchtergrond").val();
    $("#veld").css("background-color", kleur)
}

// Opdracht 2

$("#memoTekst").on("input", memoTekst);

$("#kleurMemo").on("input", kleurMemo);

$("#veld").on("click", nietsSelecteren);

function nietsSelecteren() {
    geselecteerdeMemo = null;
    $(".memo").removeClass("border-primary");
    $("#memoTekst").val("");
    $("#kleurMemo").val("#F8F8F8");
    $("#memoTekst").prop("disabled", true);
    $("#kleurMemo").prop("disabled", true);
    $("#memoTekst").attr("placeholder", "Kies eerst een memo...");
};


$("#addKnop").click(function () {
    let aantalMemos = $('.memo').length;

    if (aantalMemos >= 25) {
        alert("Je hebt het maximale aantal memo's (25) bereikt!")
    } else {

        let memo = $("<div class='memo border' style='background-color: #fff;'>...</div>");

        $("#memoveld").append(memo);
        memo.hide();
        memo.fadeIn(1000);

        if (slepen = true) {
            sleepbareMemos();
        }

    }
});

let geselecteerdeMemo = null;

$("body").on("click", ".memo", function () {
    geselecteerdeMemo = $(this);

    let kleur = geselecteerdeMemo.css("background-color");
    let hex = rgb2hex(kleur);

    $(".memo").removeClass("border-primary");
    $(this).addClass("border-primary");
    $("#memoTekst").val(geselecteerdeMemo.html());
    $("#kleurMemo").val(hex);
    $("#memoTekst").prop("disabled", false);
    $("#kleurMemo").prop("disabled", false);
    $("#memoTekst").attr("placeholder", "Vul een tekst in...");
});

$("#deleteKnop").click(function () {
    if (geselecteerdeMemo != null) {
        geselecteerdeMemo.fadeOut(500, function () {
            $(this).remove();
            nietsSelecteren();
        });
    } else {
        alert("Je hebt geen memo geselecteerd om te verwijderen...")
    }
});

function memoTekst() {
    let tekst = $("#memoTekst").val();
    geselecteerdeMemo.html(tekst);
}

function kleurMemo() {
    let kleur = $("#kleurMemo").val();
    geselecteerdeMemo.css("background-color", kleur)
}

// Opdracht 3

$("#saveKnop").click(function () {

    if (confirm("Weet je zeker dat je dit memobord wilt opslaan?") == true) {

        let titel = $("#titel").html();
        let kleurTitel = $("#titel").css("color");
        let kleurTitelHex = rgb2hex(kleurTitel);
        let grootteTitel = $("#titel").css("font-size");

        let kleurVeld = $("#veld").css("background-color");
        let kleurVeldHex = rgb2hex(kleurVeld);

        let bordObj = {};
        bordObj["titel"] = titel;
        bordObj["kleurTitel"] = kleurTitelHex;
        bordObj["grootteTitel"] = grootteTitel;

        bordObj["kleurVeld"] = kleurVeldHex;

        let memos = [];

        $(".memo").each(function () {
            let tekst = $(this).html();
            let kleurMemo = $(this).css("background-color");
            let kleurMemoHex = rgb2hex(kleurMemo);
            let topMemo = $(this).css("top");
            let leftMemo = $(this).css("left");

            let memoObj = {};
            memoObj["tekst"] = tekst;
            memoObj["kleur"] = kleurMemoHex;
            memoObj["top"] = topMemo;
            memoObj["left"] = leftMemo;

            memos.push(memoObj);
        });

        bordObj["memos"] = memos;

        let json = JSON.stringify(bordObj);

        $.ajax({
            url: "Index?handler=Verwerk",
            contentType: "application/json",
            data: {
                "memoData": json,
            },
            success: function (data) {
                alert("Het memobord is succesvol opgeslagen!");
            },
            error: function (e) {
                alert("Er is iets misgegaan met het opslaan... Check de console.");
                console.log(e);
            }
        });
    }

});

$("#readKnop").click(function () {

    if (confirm("Weet je zeker dat je het memobord wilt inlezen?") == true) {

        $.ajax({
            url: "Index?handler=Memo",
            contentType: "application/json",
            success: function (data) {

                let opgehaaldeData = JSON.parse(data);

                $("#titel").html(opgehaaldeData.titel);
                $("#titel").css("font-size", opgehaaldeData.grootteTitel);
                $("#titel").css("color", opgehaaldeData.kleurTitel);
                $("#veld").css("background-color", opgehaaldeData.kleurVeld);

                $("#titelInvoer").val(opgehaaldeData.titel);
                $("#grootteTitel").val(opgehaaldeData.grootteTitel.slice(0, -2));
                $("#kleurTitel").val(opgehaaldeData.kleurTitel);
                $("#kleurAchtergrond").val(opgehaaldeData.kleurVeld);

                nietsSelecteren()
                $("#memoveld").html("");

                for (let i = 0; i < opgehaaldeData.memos.length; i++) {

                    let memo = `<div class='memo border' style='background-color: ${opgehaaldeData.memos[i].kleur}; top: ${opgehaaldeData.memos[i].top}; left: ${opgehaaldeData.memos[i].left};'>${opgehaaldeData.memos[i].tekst}</div>`;
                    $("#memoveld").append(memo);

                }

                alert("Het memobord is succesvol ingelezen!");

            },
            error: function (e) {
                alert("Er is iets misgegaan met het inlezen... Check de console.");
                console.log(e);
            }
        });

    }
});

// Opdracht 4

function sleepbareMemos() {
    $(".memo").draggable({
        addClasses: true,
        containment: "parent"
    });
    slepen = true;
};

$("#dragKnop").on("click", sleepbareMemos);

$("#fixedKnop").click(function () {

    if ($(".memo").data("ui-draggable")) {
        $(".memo").draggable("destroy");
        $(".memo").css("position", "");
        slepen = false;
    }

});