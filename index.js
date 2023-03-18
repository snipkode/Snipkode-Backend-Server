import '@snipkode/framework';

NEWSCHEMA('Todos', function(schema){
    schema.action('buat', {
        name: 'Membuat Todos',
        input: '*nama:String,*deskripsi:String,selesai:String',
        action: function($, model){
            model.id = UID();
            model.selesai = false;
            model.cari = (model.nama + ' ' + model.deskripsi || '').toSearch();
            model.hapus = false;
            model.tanggal = NOW;
            DB().insert('nosql/todos', model)
                .callback($.done(model.id));
        }
    });

    schema.action('baca', {
        name: 'Membaca data berdasarkan id',
        params: '*id:String',
        action: function($) {
            var params = $.params;
            DB().read('nosql/todos')
                .fields('id,nama,selesai,deskripsi')
                .id(params.id).where('hapus', false)
                .callback($.callback);
        }
    });
});

/*     HTTP_METHOD          URI             SCHEMA    ACTION      */
ROUTE('POST            /api/buat/           *Todos    --> buat    ');
ROUTE('GET             /api/baca/{id}       *Todos    --> baca    ');



HTTP('debug');
