import '@snipkode/framework';

NEWSCHEMA('Todos', function(schema){

    schema.action('buat', {
        name: 'Membuat Todos',
        input: '*nama:String,*deskripsi:String,selesai:String',
        action: function($, model){
            model.id = UID();
            model.selesai = false;
            model.cari = (model.nama + ' ' + ( model.deskripsi || '')).toSearch();
            model.hapus = false;
            model.tanggal = NOW;
            DB().insert('nosql/todos', model)
                .callback($.done(model.id));
        }
    });

    schema.action('baca', {
        name: 'Membaca Data Berdasar ID',
        params: '*id:String',
        action: function($) {
            var params = $.params;
            DB().read('nosql/todos')
                .fields('id,nama,selesai,deskripsi')
                .id(params.id).where('hapus', false)
                .callback($.callback);
        }
    });
    
    schema.action('list', {
        name: 'Membaca Semua Data Todos & Pencarian (Optional)',
        query: 'search:String',
        action: function($){
            var builder = DB().find('nosql/todos');
                builder.where('hapus', false);
            $.query.search && builder.search('cari', $.query.search);
            builder.fields('id,nama,deskripsi,hapus,selesai,tanggal');
            builder.callback($.callback);
        }
    });

    schema.action('edit', {
        name: 'Mengedit Data Todos Berdasarkan ID',
        params: '*id:String',
        input:'*nama:String,deskripsi:String,selesai:String',
        action: function($, model){
            var params = $.params;
            model.updated = NOW;
            model.search = (model.nama + ' ' + ( model.deskripsi || '' ) ).toString();
            DB().update('nosql/todos', model).id(params.id)
                .where('hapus', false).error(404)
                .callback($.done(params.id));
        }
    });

    schema.action('hapus', {
        name: 'Menghapus Todo Berdasarkan ID',
        params: '*id:String',
        action: function($) {
            var params = $.params;
            DB().update('nosql/todos', { hapus: true, removed: NOW }).id(params.id)
                .where('hapus', false).error(404)
                .callback($.done());
        }
    });

    schema.action('mark', {
        name: 'Toggle status done/undone',
        params: '*id:String',
        action: function($) {
            var params = $.params;
            DB().update('nosql/todos', { '!selesai': true }).id(params.id)
                .where('hapus', false).error(404)
                .callback($.done());
        }
    })

});

/*     HTTP_METHOD          URI             SCHEMA    ACTION      */
ROUTE('GET             /api/list/           *Todos    --> list    ');
ROUTE('POST            /api/buat/           *Todos    --> buat    ');
ROUTE('GET             /api/baca/{id}/      *Todos    --> baca    ');
ROUTE('POST            /api/update/{id}/    *Todos    --> edit    ');
ROUTE('DELETE          /api/hapus/{id}/     *Todos    --> hapus   ');
ROUTE('POST            /api/toggle/{id}/    *Todos    --> mark    ');


HTTP('debug');
