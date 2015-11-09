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
    var image;

    var picture = $("#picture");
    //var picturePreview = document.getElementById("picturePreview");
    //var currentFile;

    var config = {
      "default": {
        inputStream: {
          size: 1920
          //singleChannel: false
        },
        ////tracking: true,
        locator: {
          patchSize: "small",
          halfSample: true
        },
        decoder: {
          //readers: ["ean_reader", "upc_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_8_reader", "upc_e_reader", "codabar_reader"]
          readers: ["ean_reader"]
        },
        locate: true,
        numOfWorkers: 4
        //visual: true,
        //src: src
      },
      "stream": {
        inputStream: {
          name: "Test",
          type: "ImageStream",
          length: 10,
          size: 1920
        },
        locator: {
          patchSize: "small",
          halfSample: true
        }
      },
      "i2of5_reader": {
        inputStream: {
          size: 800,
          type: "ImageStream",
          length: 5
        },
        locator: {
          patchSize: "small",
          halfSample: false
        }
      }
    };

    vm.replaceResult = function(img) {
      var content;
      image = img;

      if (!(img.src || img instanceof HTMLCanvasElement)) {
        content = $("<span>Loading image file failed</span>")
      } else {
        //picturePreview.setAttribute("src", img.src || img.toDataURL());
        content = $("<img>").append().attr("src", img.src || img.toDataURL()).attr("id", "preview");
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
      $("#codeResult").text("ready to read");

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
      //quaggaInit();
    }

    function attachListeners() {
      $("#barcodeFileInput").on("change", vm.dropChangeHandler);

      $("#startDecode").on("click", function(e) {
        var input = $("#barcodeFileInput");

        //if (input[0].files && input[0].files.length) {
        //  var tmpImageUrl = URL.createObjectURL(input[0].files[0]);
        //}
        var img = document.getElementById("preview");
        if (img) {
          var tmpImageUrl = img.getAttribute("src");
        }
        decode(tmpImageUrl);
        //start();
      });
    }

    function decode(src) {
      console.log("Decode");
      console.log("Source : ", src);

      Quagga.decodeSingle(
        angular.extend(config.default, {src: src}),
        function(result) {
        if (result && result.codeResult && result.codeResult.code) {
          $("#codeResult").text("Code : " + result.codeResult.code);
        }
        else {
          $("#codeResult").text("unable to read");
        }
      });
    }

    function quaggaInit() {
      Quagga.init(config.default, function() {
        start();
      });
    }

    function start() {
      Quagga.start();
    }

    Quagga.onProcessed(function(result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
      }
    });

    Quagga.onDetected(function(result) {
      var $node,
        canvas = Quagga.canvas.dom.image,
        detectedCode = result.codeResult.code;

      $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
      $node.find("img").attr("src", canvas.toDataURL());
      $node.find("h4.code").html(detectedCode);
      $("#result_strip ul.thumbnails").prepend($node);
    });


    //function stop() {
    //  Quagga.stop();
    //}
  }
})();