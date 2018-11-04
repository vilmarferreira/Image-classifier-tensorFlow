var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
// deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
  
  let options = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: CameraPreview.CAMERA_DIRECTION.BACK,
    toBack: true,
    tapPhoto: true,
    tapFocus: false,
    previewDrag: false
  };
CameraPreview.startCamera(options);
  
  
  $('#my-img').click(function(){
   
   
  });
  
  var self = this;
  setTimeout(function(){
   self.capturePhoto();
  },5000);
  
  
    },
 
 capturePhoto:function(){
  var self = this;
  var optionsTake = {
       width:640, 
       height:640, 
       quality: 85
       };
      CameraPreview.takePicture(optionsTake, function(base64PictureData){
     /*
    base64PictureData is base64 encoded jpeg image. Use this data to store to a file or upload.
    Its up to the you to figure out the best way to save it to disk or whatever for your application.
     */
// One simple example is if you are going to use it inside an HTML img src attribute then you would do the following:
     imageSrcData = 'data:image/jpeg;base64,' +base64PictureData;
    
    $("#deviceready").removeClass("blink");
    
    
    var tf = new TensorFlow('custom-model', {
       'label': 'My Custom Model',
       'label_path': "http://www.davifelipe.com.br/arquivos/star_wars_graph.zip#retrained_labels.txt",
       'model_path': "http://www.davifelipe.com.br/arquivos/star_wars_graph.zip#rounded_graph.pb",
       'input_size': 299,
       'image_mean': 128,
       'image_std': 128,
       'input_name': 'Mul',
       'output_name': 'final_result'
      });
    //var tf = new TensorFlow('inception-v1');
    $("#message").html("loading...");
    
    tf.onprogress = function(evt) {
     if (evt['status'] == 'downloading'){
      $("#message").html("Downloading model files...");
      $("#message").html(evt.label);
      if (evt.detail) {
       // evt.detail is from the FileTransfer API
       
       var carregados = evt.detail.loaded/1024/1024;
       var total = evt.detail.total/1024/1024;
       
       carregados = carregados.toFixed(2);
       total = total.toFixed(2);
       
       var perc = (carregados * 100 / total).toFixed(2);
       
       $("#message").html(`${perc}% ${carregados}MB de ${total}MB`);
      }
     } else if (evt['status'] == 'unzipping') {
      $("#message").html("Extracting contents...");
     } else if (evt['status'] == 'initializing') {
      $("#message").html("Initializing TensorFlow");
     }
    };
    
    $('#my-img').attr('src', imageSrcData);
    
    tf.classify(base64PictureData).then(function(results) {
     $("#message").html("");
     results.forEach(function(result) {
      $("#message").append(result.title + " " + result.confidence+" <br/>");
     });
     self.capturePhoto();
    },
    function(error){
     $("#message").html(error);
    });
    
   },
   function(error){
    alert("error: "+error);
   });
 },
 
 
 
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
console.log('Received Event: ' + id);
    }
};
app.initialize();