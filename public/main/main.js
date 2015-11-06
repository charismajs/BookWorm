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
    var picturePreview = document.getElementById("picturePreview");
    //var currentFile;

    vm.replaceResult = function(img) {
      var content;
      if (!(img.src || img instanceof HTMLCanvasElement)) {
        content = $("<span>Loading image file failed</span>")
      } else {
        picturePreview.setAttribute("src", img.src || img.toDataURL());
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
      //document.getElementById("barcodeFileInput").onchange = function(e) {
      //  var file = e.target.files[0];
      //  var canvas = document.getElementById("picture");
      //  var ctx = canvas.getContext("2d");
      //  var cx = 0, cy = 0;
      //
      //  var image = document.getElementById("picturePreview");
      //  var URL = window.URL || window.webkitURL;
      //  var imageURL = URL.createObjectURL(file);
      //  image.setAttribute("src", imageURL);
      //
      //  var cw = image.width, ch = image.height;
      //  var orientation = 1;
      //
      //  loadImage.parseMetaData(
      //    file,
      //    function(data) {
      //      if (!data.imageHead) return;
      //
      //      orientation = data.exif.get("Orientation");
      //      var imageWidth = data.exif.get("ImageWidth");
      //      var imageHeight = data.exif.get("ImageHeight");
      //
      //      console.log("Orientation : ", orientation);
      //
      //      switch (orientation) {
      //        case 8:
      //          ctx.rotate(90 * Math.PI / 180);
      //          cw = image.height;
      //          ch = image.width;
      //          cy = image.height * (-1);
      //          break;
      //        case 3:
      //          ctx.rotate(180 * Math.PI / 180);
      //          cx = image.width * (-1);
      //          cy = image.height * (-1);
      //          break;
      //        case 6:
      //          ctx.rotate(-90 * Math.PI / 180);
      //          cw = image.height;
      //          ch = image.width;
      //          cx = image.width * (-1);
      //          break;
      //      }
      //    },
      //    {
      //      maxMetaDataSize: 262144,
      //      disableImageHead: false
      //    }
      //  );
      //
      //  loadImage(
      //    file,
      //    function(img) {
      //      //document.body.appendChild(img);
      //      canvas.setAttribute('width', cw);
      //      canvas.setAttribute('height', ch);
      //      ctx.drawImage(img, cx,cy);
      //    },
      //    {
      //      maxWidth: 500,
      //      minWidth: 100,
      //      orientation: orientation,
      //      canvas: true
      //    }
      //  );
      //
      //};

      $("#startDecode").on("click", function(e) {
        var input = $("#barcodeFileInput");
        if (input[0].files && input[0].files.length) {
          var tmpImageUrl = URL.createObjectURL(input[0].files[0]);
        }
        decode(tmpImageUrl);
      });

      //$("#barcodeFileInput").on("change", function(e) {
      //  $("#codeResult").text(" ");
      //  var files = e.target.files, file;
      //  var canvas = document.getElementById("picture");
      //  var ctx = canvas.getContext("2d");
      //
      //
      //  if (files && files.length > 0) {
      //    file = files[0];
      //    try {
      //      var URL = window.URL || window.webkitURL;
      //      var imageURL = URL.createObjectURL(file);
      //      $("#picturePreview").attr("src", imageURL);
      //    }
      //    catch(e) {
      //      try {
      //        var fileReader = new FileReader();
      //
      //        fileReader.onload = function(event) {
      //          $("#picturePreview").attr("src", event.target.result);
      //        };
      //
      //        fileReader.onloadend = function(event) {
      //          var exif = EXIF.readFromBinaryFile(new BinaryFile(event.target.result));
      //          console.log("EXIF : ", exif);
      //          $("#debug").text(exif.orientation);
      //
      //          switch(exif.Orientation){
      //            case 8:
      //              ctx.rotate(90 * Math.PI / 180);
      //              break;
      //            case 3:
      //              ctx.rotate(180 * Math.PI / 180);
      //              break;
      //            case 6:
      //              ctx.rotate(-90 * Math.PI / 180);
      //              break;
      //          }
      //        };
      //
      //        fileReader.readAsDataURL(file);
      //      }
      //      catch(err) {
      //        $("#codeResult").text("Fail! createObjectURL and FileReader are not supported by browser");
      //      }
      //    }
      //  }
      //
      //});
    }

    //function detachListeners() {
    //  $("#startDecode").off("click");
    //}

    function decode(src) {
      console.log("Decode");
      console.log("Source : ", src);

      Quagga.decodeSingle({
        inputStream: {
          size: 640,
          singleChannel: false
        },
        locator: {
          patchSize: "large",
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