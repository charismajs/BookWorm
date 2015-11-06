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

    var picture = $("#picture");
    //var picturePreview = document.getElementById("picturePreview");
    //var currentFile;

    vm.replaceResult = function(img) {
      var content;
      if (!(img.src || img instanceof HTMLCanvasElement)) {
        content = $("<span>Loading image file failed</span>")
      } else {
        //picturePreview.setAttribute("src", img.src || img.toDataURL());
        content = $("<img>").append().attr("src", img.src || img.toDataURL());
      }
      picture.children().replaceWith(content);
    };

    vm.displayImage = function(file, options) {
      //currentFile = file;
      if (!loadImage(file, vm.replaceResult, options)) {
        picture.children().replaceWith($("<span>Your browser does not support the URL or FileReader API.</span>"));
      }
    };

    vm.dropChangeHandler = function(e) {
      e.preventDefault();
      e = e.originalEvent;
      var target = e.dataTransfer || e.target,
        file = target && target.files && target.files[0];
      var options = {
        maxWidth: picture.width(),
        canvas: true
      };

      if (!file) return;
      loadImage.parseMetaData(file, function(data) {
        if (data.exif) {
          options.orientation = data.exif.get("Orientation");
        }

        vm.displayImage(file, options);
      });
    };


    activate();

    function activate() {
      init();
    }

    function init() {
      attachListeners();
    }

    function attachListeners() {
      $("#barcodeFileInput").on("change", vm.dropChangeHandler);

      $("#startDecode").on("click", function(e) {
        var input = $("#barcodeFileInput");
        if (input[0].files && input[0].files.length) {
          var tmpImageUrl = URL.createObjectURL(input[0].files[0]);
        }
        decode(tmpImageUrl);
      });
    }

    function decode(src) {
      console.log("Decode");
      console.log("Source : ", src);

      Quagga.decodeSingle({
        inputStream: {
          //size: 640,
          singleChannel: false
        },
        tracking: true,
        locator: {
          patchSize: "medium",
          halfSample: false
        },
        decoder: {
          readers: ["upc_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_8_reader", "ean_reader", "upc_e_reader", "codabar_reader"]
        },
        locate: true,
        //visual: true,
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


    //function stop() {
    //  Quagga.stop();
    //}
  }
})();