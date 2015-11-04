/**
 * Created by LuckyJS on 2015. 11. 4..
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = [];

  function MainCtrl() {
    var vm = this;

    activate();

    function activate() {
      init();
    }

    function init() {
      attachListeners();
    }

    function attachListeners() {
      $("#startDecode").on("click", function(e) {
        var input = $("#barcodeFileInput");
        if (input[0].files && input[0].files.length) {
          var tmpImageUrl = URL.createObjectURL(input[0].files[0]);
        }
        decode(tmpImageUrl);
      });

      $("#barcodeFileInput").on("change", function(e) {
        $("#codeResult").text(" ");
        var files = e.target.files;
        if (files && files.length > 0) {
          var file = files[0];
          try {
            var URL = window.URL || window.webkitURL;
            var imageURL = URL.createObjectURL(file);
            $("#picturePreview").attr("src", imageURL);
          }
          catch(e) {
            try {
              var fileReader = new FileReader();
              fileReader.onload = function(event) {
                $("#picturePreview").attr("src", event.target.result);
              };
              fileReader.readAsDataURL(file);
            }
            catch(err) {
              $("#codeResult").text("Fail! createObjectURL and FileReader are not supported by browser");
            }
          }
        }
      });
    }

    function detachListeners() {
      $("#startDecode").off("click");
    }

    function decode(src) {
      console.log("Decode");
      Quagga.decodeSingle({
        inputStream: {
          size: 640,
          singleChannel: false
        },
        location: {
          patchSize: "large",
          halfSample: false
        },
        decoder: {
          readers: ["upc_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_8_reader", "ean_reader", "upc_e_reader", "codabar_reader"]
        },
        locate: true,
        src: src
      }, function(result) {
        if (result && result.codeResult && result.codeResult.code) {
          $("#codeResult").text("Code : " + result.codeResult.code);
        }
        else {
          $("#codeResult").text("unable to read");
        }
      })
    }

    function stop() {
      Quagga.stop();
    }
  }
})();