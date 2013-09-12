/* jshint unused:true */
/* global jQuery:false */
/*
9782070327249
9781904777434
9782253153955
9782253141709
9782070342402
9782266139328
9782070445585
*/
(function($, window, document, undefined) {
    "use strict";

    var call = {
        init: function(){
            this.csvContent = '';
            this.listenInput( $('#infos') );
        },
        listenInput: function( $input ){
            var self = this,
            delayedCallback,
            inputValues;

            $input.on('keyup change',function(){
                inputValues = $(this).val();

                self.toggleLoading();
                
                clearTimeout( delayedCallback );

                delayedCallback = setTimeout(function(){
                    self.showInfo( inputValues );
                },800);
            });
        },
        showInfo: function( inputValues ) {
            var self = this,
                isbnNumbers = inputValues.match(/\w+/g),
                i = isbnNumbers.length;
                console.log(i); 
            
            self.refreshCsv();
            
            isbnNumbers.forEach(function(isbn){   // FOREACH
                $.ajax({
                    url: 'https://www.googleapis.com/books/v1/volumes',
                    dataType: 'jsonp',
                    data: {
                        q : "id:" + isbn,
                        key: "AIzaSyDI31ZBJbrhST7-RK-crm0XC2wY6vNlj7I"
                    },
                    success: function( data ){
                        i--;
                        if( data.totalItems === 0){
                            $('.output-no-found').append("<p><b>"+ isbn +"</b></p>");
                        }else if(data.totalItems > 1){
                            console.log("Too much book found for the isbn: " + isbn);
                        }else{
                            $('.output-found').append("<p>Title : <b>"+data.items[0].volumeInfo.title+"</b> - Authors: <b>"+data.items[0].volumeInfo.authors+"</b></p>");
                            self.csvContent +=
                                data.items[0].volumeInfo.title + ',' +
                                data.items[0].volumeInfo.authors + '\n';
                            self.generateCsv( self.csvContent );
                        }
                        if (i === 0) {
                            self.toggleLoading();
                        }
                    }
                });
            }); // END FOREACH
        },
        refreshCsv: function(){
            $('.output-no-found').empty();
            $('.output-found').empty();
            this.csvContent = '';
        },
        generateCsv: function( csvContent ){
            var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
            $('.dl').attr("href", encodedUri);
            $('.dl').attr("download", "my_data.csv");
        },
        toggleLoading:function(){
            $('.dl').toggle();
            $('.ajax-loader-gif').toggle();
        }
};

call.init();

})(jQuery, window, document);