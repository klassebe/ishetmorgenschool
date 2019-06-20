$( document ).ready(function() {
    var colors = new Array( "orange", "yellow", "green", "light-blue", "aubergine", "pink", "pastel-yellow", "pastel-green", "pastel-blue", "pastel-purple", "pastel-pink" );
    var color = Math.floor( Math.random() * Math.floor(colors.length) );
    $("body").addClass( "theme-" + colors[color] );
    $.getJSON( "js/dates.json?ts="+moment().format("X"), function( data ) {
        var school = 1;
        var datum = getUrlParameter("datum");
        //console.log(param);
        var today = moment( datum );
        if ( !today.isValid() ) {
            today = moment();
        }
        var tomorrow = today.add(1, 'days');
        var meta = "Morgen, " + tomorrow.format("dddd D MMMM") + ", is normaalgezien een schooldag.";
        if ( 6 == tomorrow.day() || 0 == tomorrow.day() ) {
            school = 0;
            meta =  'Het is ' + tomorrow.format("dddd D MMMM") + ' morgen! Misschien moet je wel naar de muziek- of tekenschool, of een bijzondere activiteit op school.';
        }
        var vicon = "&#x1F98B";
        
        $( data ).each( function(i) {
            var start = moment(data[i].start);
            var end = moment(data[i].end).add( 86399, 'seconds' );
            if ( tomorrow.isSameOrBefore(end) && tomorrow.isSameOrAfter(start) ) {
                school = 0;
                if ( typeof data[i].icon !== 'undefined' ) {
                    vicon = data[i].icon;
                }
                meta =  'Morgen, ' + tomorrow.format( "D MMMM" ) + ', is het ' + data[i].name + '!';
            }
        });
        if ( 0 == school ) {
            $( "#js_antwoord" ).addClass( "antwoord--showidee" ); 
            $( "#js_antwoord_txt" ).html( 'Nee!' );
            $( "#js_antwoord_icon" ).html( vicon );
            $.getJSON( "js/checklist.json?ts="+moment().format("X"), function( data ){
                showidee( data );
            });
        } else {
            $( "#js_antwoord_txt" ).html( 'Ja!' );
            $( "#js_antwoord_icon" ).html( "&#x1F392" );
        }
        $( "#js_antwoord_meta" ).html( meta );
    });

    function showidee( data, cnt = 3 ) {
        console.log( data );
        ideelist = new Array();
        ideegroups = new Array();
        while (ideelist.length < cnt) {
            var idee = Math.floor( Math.random() * Math.floor( data.length ) );
            if ( !ideelist.includes( idee ) && !ideegroups.includes( data[idee].groep ) ) {
                ideelist.push( idee );
                ideegroups.push( data[idee].groep );
            };
        }
        //console.log( ideelist );
        //console.log( ideegroups );
        $( ideelist ).each( function(i) {
            console.log(data[ideelist[i]]);
            $( "#js_antwoord_idee" ).append("<li>" + data[ideelist[i]].idee + "</li>");
        });
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
 
});