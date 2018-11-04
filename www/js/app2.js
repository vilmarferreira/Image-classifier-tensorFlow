document.addEventListener("deviceready", init, false);
function init() {
	
	function onSuccess(imageData) {
		console.log('success');
        var image = document.getElementById('myImage');
        // image.src = "data:image/jpeg;base64," + imageData;
        // a= "data:image/jpeg;base64," + imageData;
        // image.src = imageData;

        var teste1= document.getElementById('message');
        teste1.textContent='Ola mundo'
        // console.log(imageData);
     app.teste(imageData);
     

        
}

	function onFail(message) {
		alert('Failed because: ' + message);
	}	

	//Use from Camera
	document.querySelector("#takePicture").addEventListener("touchend", function() {
		navigator.camera.getPicture(onSuccess, onFail, { 
            targetWidth: 600,
            targetHeight: 600,
			quality: 85,
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.DATA_URL
		});

	});
	
	//Use from Library
	document.querySelector("#usePicture").addEventListener("touchend", function() {
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 50,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: Camera.DestinationType.DATA_URL
		});

	});

}
var app={
teste:function(base64PictureData){
    imageSrcData = 'data:image/jpeg;base64,'+base64PictureData;
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
       texto = document.getElementById('message')
    //    $("#message").html("teste...");
        texto.textContent= 'loading...';
       tf.onprogress = function(evt) {
        if (evt['status'] == 'downloading'){
        texto.textContent = 'Downloading model files...'
        texto.textContent = evt.label
         
         if (evt.detail) {
          // evt.detail is from the FileTransfer API
          
          var carregados = evt.detail.loaded/1024/1024;
          var total = evt.detail.total/1024/1024;
          
          carregados = carregados.toFixed(2);
          total = total.toFixed(2);
          
          var perc = (carregados * 100 / total).toFixed(2);
          texto.textContent = perc+ '%'+ carregados+'MB de '+total+'MB'
        
         }
        } else if (evt['status'] == 'unzipping') {
            texto.textContent = 'Extraindo arquivos'
        
        } else if (evt['status'] == 'initializing') {
            texto.textContent = 'Iniciando o TensorFlow...';
        }
       };

       var image = document.getElementById('myImage');
       image.src = imageSrcData;
       console.log(imageSrcData);
       console.log(base64PictureData)
       texto.textContent = 'teste'
       tf.classify(base64PictureData).then(function(results) {
        texto.textContent = ' '
        
        results.forEach(function(result) {
            texto.textContent = ('resultado: '+result.title + " " + result.confidence)
        //  $("#message").append(result.title + " " + result.confidence+" <br/>");
        });
        // self.capturePhoto();
       },
       function(error){
           texto.textContent = error
        // $("#message").html(error);
       });
       
}
}