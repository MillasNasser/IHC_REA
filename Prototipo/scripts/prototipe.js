function Start(qntLines, qntAddress){
    genLinesNum(qntLines);
    genAddressNum(qntAddress);
}

function genLinesNum(qnt){
    for (let i = 0; i < qnt; i++) {
        document.getElementById("LineNumbers").innerHTML += "<div class=''>" + i +  "</div>";
    }
}

function genAddressNum(qnt){
    for (let i = 0; i < qnt; i++) {
        document.getElementById("MemTabl").innerHTML += 
        "<div class='MemBody'> \
            <div class='MCol1 Dark-Base'>0x" + ("0000" + (i*4).toString(16).toUpperCase()).slice(-4) + "</div> \
            <div class='MCol2'><input type='text'/></div>\
            <div class='MCol3'><input type='text'/></div>\
            <div class='MCol4'><input type='text'/></div>\
        </div>";
    }
}